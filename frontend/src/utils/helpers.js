import { FREE_SHIPPING_THRESHOLD } from './constants';

/**
 * Format price with PKR currency
 */
export const formatPrice = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

/**
 * Calculate discount percentage between old and new price
 */
export const calcDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

/**
 * Apply coupon discount to total
 */
export const applyCouponDiscount = (total, discountPercent) => {
  return total - (total * discountPercent) / 100;
};

/**
 * Check if order qualifies for free shipping
 */
export const isFreeShipping = (total) => total >= FREE_SHIPPING_THRESHOLD;

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (str, maxLen = 80) => {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
};

/**
 * Generate a simple slug from a name
 */
export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

/**
 * Get initials from a name (for avatar fallback)
 */
export const getInitials = (name = '') => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'G';
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
