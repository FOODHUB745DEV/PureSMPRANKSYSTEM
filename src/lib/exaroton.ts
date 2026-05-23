
/**
 * @fileOverview Service zur Kommunikation mit der Exaroton API.
 */

export interface ExarotonServerStatus {
  name: string;
  address: string;
  status: number; // 0=OFFLINE, 1=ONLINE, 2=STARTING, 3=STOPPING, 4=RESTARTING, 5=SAVING, 6=LOADING, 7=CRASHED
  players: {
    max: number;
    count: number;
    list: string[];
  };
}

const EXAROTON_API_URL = 'https://api.exaroton.com/v1';

/**
 * Ruft den aktuellen Status des Exaroton Servers ab.
 */
export async function getExarotonStatus(): Promise<ExarotonServerStatus | null> {
  const apiKey = process.env.EXAROTON_API_KEY;
  const serverId = process.env.EXAROTON_SERVER_ID;

  if (!apiKey || !serverId) {
    console.warn('Exaroton API Key oder Server ID fehlt in .env');
    return null;
  }

  try {
    const res = await fetch(`${EXAROTON_API_URL}/servers/${serverId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 30 } // Cache für 30 Sekunden
    });

    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data;

    return {
      name: data.name,
      address: data.address,
      status: data.status,
      players: {
        max: data.players.max,
        count: data.players.count,
        list: data.players.list,
      }
    };
  } catch (e) {
    console.error('Fehler beim Abrufen des Exaroton Status:', e);
    return null;
  }
}

/**
 * Sendet einen Konsolenbefehl an den Exaroton Server.
 */
export async function sendExarotonCommand(command: string): Promise<boolean> {
  const apiKey = process.env.EXAROTON_API_KEY;
  const serverId = process.env.EXAROTON_SERVER_ID;

  if (!apiKey || !serverId) return false;

  try {
    const res = await fetch(`${EXAROTON_API_URL}/servers/${serverId}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    return res.ok;
  } catch (e) {
    console.error('Fehler beim Senden des Exaroton Commands:', e);
    return false;
  }
}
