import { useCallback, useMemo } from 'react';
import type { CartItem } from '../types';
import {
  buildCartOrderUrl,
  buildProductEnquiryText,
  buildProductEnquiryUrl,
  type ProductEnquiryInput,
} from '../lib/social';
import { openExternalUrl } from '../components/ui/SocialGlyphs';

export const useSocialOrder = () => {
  /** Opens WhatsApp with a question about the product instead of an order. */
  const askOnWhatsApp = useCallback((input: ProductEnquiryInput) => {
    openExternalUrl(buildProductEnquiryUrl(input));
  }, []);

  const orderCartOnWhatsApp = useCallback((items: CartItem[], totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  }) => {
    openExternalUrl(buildCartOrderUrl(items, totals));
  }, []);

  return useMemo(
    () => ({ askOnWhatsApp, orderCartOnWhatsApp }),
    [askOnWhatsApp, orderCartOnWhatsApp]
  );
};
