const API_URL = (process.env as Record<string, string | undefined>).EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados.');
  }
  return response.json() as Promise<T>;
}
