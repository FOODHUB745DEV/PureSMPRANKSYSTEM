
'use client';

import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Generiert einen zufälligen 8-stelligen Code.
 */
function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Erstellt einen neuen Rang-Code in Firestore.
 */
export async function createRankCodeAction(username: string, rankId: string) {
  const { firestore } = initializeFirebase();
  const code = generateRandomCode();
  
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
}
