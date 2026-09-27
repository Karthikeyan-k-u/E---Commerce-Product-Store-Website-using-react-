import { hashCode } from '../lib/hash';

export interface CommunityFriend {
  id: string;
  name: string;
  units: number;
}

const CONTACT_POOL = [
  'Arun Kumar',
  'Deepa Venkatesh',
  'Sameer Joshi',
  'Latha Bhavani',
  'Manoj Thakur',
  'Shruti Hegde',
  'Ganesh Murthy',
  'Bhavana Suresh',
  'Ravi Chandran',
  'Aparna Ghosh',
  'Vivek Anand',
  'Swathi Prasad',
  'Harish Babu',
  'Neethu Mathew',
  'Suresh Raina',
  'Kavya Sundaram',
  'Dinesh Pai',
  'Meghna Joshi',
  'Yogesh Kulkarni',
  'Reshma Nair',
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Walking the pool by a stride coprime to its length guarantees no repeat names. */
const pickNames = (seed: number, count: number): string[] => {
  const size = CONTACT_POOL.length;
  const start = seed % size;
  let stride = 1 + (seed % (size - 1));
  while (gcd(stride, size) !== 1) stride += 1;
  return Array.from({ length: count }, (_, index) => CONTACT_POOL[(start + stride * index) % size]);
};

/**
 * How many of the visitor's contacts are in this community. Zero is a real and
 * common answer, so the caller has to render an empty state rather than assume
 * there is always somebody to show. Capped at 5 because a longer row stops
 * reading as "people like me" and starts reading as a directory.
 */
export const buildFriendsInCommunity = (communitySlug: string): CommunityFriend[] => {
  const seed = hashCode(communitySlug);
  const count = seed % 6; // 0-5 inclusive
  const names = pickNames(seed, count);

  return names.map((name, index) => ({
    id: `${communitySlug}-friend-${index}`,
    name,
    units: 1 + (hashCode(`${communitySlug}-f-${index}`) % 4),
  }));
};

export const contactsInLabel = (count: number, communityName: string): string =>
  count === 1
    ? `1 of your contacts is in ${communityName}`
    : `${count} of your contacts are in ${communityName}`;
