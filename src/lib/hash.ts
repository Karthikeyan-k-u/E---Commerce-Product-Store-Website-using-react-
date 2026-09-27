/**
 * FNV-1a plus a murmur-style finalizer. Our product ids are sequential, so
 * without the avalanche step neighbouring ids land on neighbouring seed values
 * and every drop in a category gets the same looking social proof.
 */
export const hashCode = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 2246822519);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 3266489917);
  hash ^= hash >>> 16;
  return hash >>> 0;
};
