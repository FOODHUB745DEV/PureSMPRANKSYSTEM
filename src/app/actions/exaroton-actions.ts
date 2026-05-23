
'use server';

import { getExarotonStatus, sendExarotonCommand } from '@/lib/exaroton';

/**
 * Server Action um den Status für die Client-Seite abzurufen.
 */
export async function fetchServerStatusAction() {
  return await getExarotonStatus();
}

/**
 * Server Action um einen Rang nach dem Kauf zu vergeben.
 * Nutzt standardmäßig LuckPerms (/lp).
 */
export async function grantRankAction(username: string, rankId: string) {
  // Befehl zur Rangvergabe (Beispiel für LuckPerms)
  // Wir nutzen kleingeschriebene Ränge für die Permissions
  const command = `lp user ${username} parent add ${rankId.toLowerCase()}`;
  
  // Zusätzliche Nachricht im Chat
  const broadcastCommand = `say Willkommen im Team, ${username}! Viel Spaß mit dem ${rankId} Rang.`;
  
  const success = await sendExarotonCommand(command);
  if (success) {
    await sendExarotonCommand(broadcastCommand);
  }
  
  return success;
}
