
'use client';

import { collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import codesData from '@/lib/codes.json';

/**
 * Holt einen verfügbaren Code aus der vordefinierten Liste.
 */
async function getNextAvailableCode(): Promise<string> {
  const { firestore } = initializeFirebase();
  const codesCollection = collection(firestore, 'rank_codes');
  
  // Alle bereits benutzten Codes abrufen
  const querySnapshot = await getDocs(codesCollection);
  const usedCodes = querySnapshot.docs.map(doc => doc.data().code);
  
  // Verfügbare Codes filtern
  const availableCodes = codesData.codes.filter(c => !usedCodes.includes(c));
  
  if (availableCodes.length === 0) {
    throw new Error('Keine Aktivierungscodes mehr verfügbar!');
  }
  
  // Zufälligen Code aus den verfügbaren wählen
  const randomIndex = Math.floor(Math.random() * availableCodes.length);
  return availableCodes[randomIndex];
}

/**
 * Erstellt einen neuen Rang-Code in Firestore basierend auf der vordefinierten Liste.
 */
export async function createRankCodeAction(username: string, rankId: string) {
  const { firestore } = initializeFirebase();
  
  try {
    const code = await getNextAvailableCode();
    const codeRef = doc(collection(firestore, 'rank_codes'));
    
    const data = {
      code: code,
      username: username,
      rankId: rankId,
      used: false,
      createdAt: serverTimestamp()
    };

    // Wir nutzen kein await hier gemäß Guidelines für Mutationen,
    // fügen aber einen catch-Block für Sicherheitsregeln-Fehler hinzu.
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
