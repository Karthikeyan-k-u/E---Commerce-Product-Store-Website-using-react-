import { useMemo } from 'react';
import { buildFriendsInCommunity, type CommunityFriend } from '../data/friends';

/**
 * Contacts of yours who are in this product's community. Deliberately a hook of
 * its own so nothing can pull it into a product card by accident: cards stay
 * about the crowd, this is about your own people.
 */
export const useFriendsInCommunity = (communitySlug: string): CommunityFriend[] =>
  useMemo(() => buildFriendsInCommunity(communitySlug), [communitySlug]);
