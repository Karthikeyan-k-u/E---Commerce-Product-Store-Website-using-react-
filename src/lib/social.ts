import type { CartItem, Product, ProductColor } from '../types';
import { formatINR } from './utils';

const BRAND_NAME = 'Whole Mart';

export const WHATSAPP_BUSINESS_NUMBER = '919342856754';
export const WHATSAPP_DISPLAY_NUMBER = '+91 93428 56754';

export const DEFAULT_PHONE_PREFIX = '+91';

export const INSTAGRAM_HANDLE = 'mass_karthik_777_';

export const INSTAGRAM_URL = (
  import.meta.env.VITE_INSTAGRAM_URL || `https://instagram.com/${INSTAGRAM_HANDLE}`
).trim();

export const isInstagramConfigured = /^https:\/\/(www\.)?instagram\.com\/[^/]+/i.test(
  INSTAGRAM_URL
);

const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

export const normalizePhone = (value: string) => value.replace(/[\s()\-.]/g, '');

export const isValidPhone = (value: string) => E164_PATTERN.test(normalizePhone(value));

const openWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
};

const variantLine = (color?: ProductColor, size?: string) => {
  const parts: string[] = [];
  if (color?.name) parts.push(`Color: ${color.name}`);
  if (size) parts.push(`Size: ${size}`);
  return parts.join('\n');
};

export interface CartOrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const buildCartOrderText = (items: CartItem[], totals: CartOrderTotals) => {
  if (items.length === 0) {
    return [
      `Hi ${BRAND_NAME}! I would like to place an order.`,
      '',
      'My name:',
      'My number:',
      'Delivery pincode:',
      '',
      'Please help me with the details. Thank you!',
    ].join('\n');
  }

  const itemLines = items.map((item, index) => {
    const variant = variantLine(item.selectedColor, item.selectedSize);
    return [
      `${index + 1}. ${item.name} x${item.quantity}`,
      variant ? `  ${variant.replace(/\n/g, '\n  ')}` : null,
      `  ${formatINR(item.price * item.quantity)}`,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  });

  return [
    `Hi ${BRAND_NAME}! I would like to place an order.`,
    '',
    ...itemLines,
    '',
    `Subtotal: ${formatINR(totals.subtotal)}`,
    totals.discount > 0 ? `Discount: -${formatINR(totals.discount)}` : null,
    `Shipping: ${totals.shipping > 0 ? formatINR(totals.shipping) : 'Free'}`,
    `Total: ${formatINR(totals.total)}`,
    '',
    'My name:',
    'My number:',
    'Delivery address:',
    'Pincode:',
    '',
    'Please confirm my order. Thank you!',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
};

export const buildCartOrderUrl = (items: CartItem[], totals: CartOrderTotals) =>
  openWhatsAppUrl(buildCartOrderText(items, totals));

export interface ProductEnquiryInput {
  product: Product;
  productUrl: string;
  currentPrice: number;
  listPrice: number;
  groupBuyLine?: string;
  friendName?: string;
}

/**
 * The enquiry a shopper sends when they tap a buyer's avatar on a product card.
 * It carries the product, the live group-buy standing, and the friend who
 * pointed them at it, then leaves blank lines for the actual question.
 */
export const buildProductEnquiryText = ({
  product,
  productUrl,
  currentPrice,
  listPrice,
  groupBuyLine,
  friendName,
}: ProductEnquiryInput) => {
  const hasDiscount = listPrice > currentPrice;

  return [
    `Hi ${BRAND_NAME}! I have a question about this product.`,
    '',
    `Product: ${product.name}`,
    `Brand: ${product.brand}`,
    hasDiscount ? `Price: ${formatINR(currentPrice)} (was ${formatINR(listPrice)})` : `Price: ${formatINR(currentPrice)}`,
    groupBuyLine ?? null,
    friendName ? `${friendName} from the community bought this, so I want the same price.` : null,
    `Link: ${productUrl}`,
    '',
    'Is it in stock right now?',
    'What is the delivery time to my pincode?',
    'My name:',
    'My number:',
    'Delivery pincode:',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
};

export const buildProductEnquiryUrl = (input: ProductEnquiryInput) =>
  openWhatsAppUrl(buildProductEnquiryText(input));

export const buildWhatsAppUrl = (phone: string) => {
  const message = `Hi ${BRAND_NAME}, I want Instagram updates and WhatsApp offers. My number is ${normalizePhone(
    phone
  )}.`;

  return openWhatsAppUrl(message);
};
