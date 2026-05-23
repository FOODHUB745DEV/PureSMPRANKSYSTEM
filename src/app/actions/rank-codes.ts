'use client';

import { collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import codesData from '@/lib/codes.json';

/**
 * Mischt ein Array nach dem Fisher-Yates Prinzip für echte Zufälligkeit.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Holt einen verfügbaren Code aus der Liste.
 * Verwendet Dokument-IDs zur effizienten Filterung bereits genutzter Codes.
 */
async function getNextAvailableCode(): Promise<string> {
  const { firestore } = initializeFirebase();
  const codesCollection = collection(firestore, 'rank_codes');
  
  // Alle bereits in Firestore existierenden Codes abrufen (ID = Code)
  const querySnapshot = await getDocs(codesCollection);
  const usedCodes = new Set(querySnapshot.docs.map(doc => doc.id));
  
  // Verfügbare Codes filtern (Codes, die noch nicht in Firestore sind)
  const availableCodes = codesData.codes.filter(c => !usedCodes.has(c));
  
  if (availableCodes.length === 0) {
    throw new Error('KEINE CODES MEHR VERFÜGBAR! Bitte fülle die codes.json auf.');
  }
  
  // Liste mischen, um sicherzustellen, dass nicht immer der erste Code gewählt wird
  const shuffled = shuffleArray(availableCodes);
  return shuffled[0];
}

/**
 * Erstellt einen neuen Rang-Code in Firestore.
 */
export async function createRankCodeAction(username: string, rankId: string) {
  const { firestore } = initializeFirebase();
  
  try {
    const code = await getNextAvailableCode();
    // Der Code selbst ist die Dokument-ID
    const codeRef = doc(firestore, 'rank_codes', code);
    
    const data = {
      code: code,
      username: username,
      rankId: rankId,
      used: false,
      createdAt: serverTimestamp()
    };

    // Speichern in Firestore (Optimistisches Update gemäß Guidelines)
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
