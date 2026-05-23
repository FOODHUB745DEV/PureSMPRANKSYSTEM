'use client';

import { collection, doc, setDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import codesData from '@/lib/codes.json';

/**
 * Holt einen verfügbaren Code aus der vordefinierten Liste.
 * Ein Code gilt als verfügbar, wenn er noch NICHT in der 'rank_codes' Collection existiert.
 */
async function getNextAvailableCode(): Promise<string> {
  const { firestore } = initializeFirebase();
  const codesCollection = collection(firestore, 'rank_codes');
  
  // Alle bereits zugewiesenen Codes abrufen
  const querySnapshot = await getDocs(codesCollection);
  const usedCodes = querySnapshot.docs.map(doc => doc.data().code);
  
  // Verfügbare Codes aus der JSON-Liste filtern
  const availableCodes = codesData.codes.filter(c => !usedCodes.includes(c));
  
  if (availableCodes.length === 0) {
    throw new Error('KEINE CODES MEHR VERFÜGBAR! Bitte fülle die codes.json auf.');
  }
  
  // Zufälligen Code aus den verbleibenden wählen
  const randomIndex = Math.floor(Math.random() * availableCodes.length);
  return availableCodes[randomIndex];
}

/**
 * Erstellt einen neuen Rang-Code in Firestore.
 * Der Code selbst wird als Dokument-ID verwendet, um Dubletten zu vermeiden.
 */
export async function createRankCodeAction(username: string, rankId: string) {
  const { firestore } = initializeFirebase();
  
  try {
    const code = await getNextAvailableCode();
    // Wir nutzen den Code als ID, um sicherzustellen, dass er nur einmal existieren kann
    const codeRef = doc(firestore, 'rank_codes', code);
    
    const data = {
      code: code,
      username: username,
      rankId: rankId,
      used: false,
      createdAt: serverTimestamp()
    };

    // Optimistisches Update ohne await (gemäß Guidelines)
    setDoc(codeRef, data)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: codeRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    return code;
  } catch (error: any) {
    console.error('Fehler bei der Code-Zuweisung:', error);
    throw error;
  }
}
