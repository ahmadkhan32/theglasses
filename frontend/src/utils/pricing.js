import { FREE_SHIPPING_THRESHOLD } from './constants';

const SHIPPING_FEE = 200;

/**
 * Calculate order subtotal from cart items
 */
export const calcSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

/**
 * Calculate shipping cost (free above threshold)
 */
export const calcShipping = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

/**
 * Calculate coupon discount amount
 */
export const calcCouponDiscount = (subtotal, couponPercent = 0) =>
  Math.round((subtotal * couponPercent) / 100);

/**
 * Calculate bank transfer discount (10%)
 */
export const calcBankDiscount = (subtotal, paymentMethod) =>
  paymentMethod === 'bank' ? Math.round((subtotal * 10) / 100) : 0;

/**
 * Calculate grand total
 */
export const calcGrandTotal = ({ subtotal, shipping, couponDiscount = 0, bankDiscount = 0 }) =>
  Math.max(0, subtotal + shipping - couponDiscount - bankDiscount);
