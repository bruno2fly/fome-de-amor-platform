export type UploadTarget = 'image' | 'pdf';

export function getStorageKey(target: UploadTarget, filename: string) {
  const safeName = filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  return `${target}s/${Date.now()}-${safeName}`;
}
