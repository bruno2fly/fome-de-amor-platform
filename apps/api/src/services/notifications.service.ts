type PushPayload = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export async function sendExpoPushNotification(payload: PushPayload) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar notificação Expo.');
  }

  return response.json();
}
