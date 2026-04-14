import { FREE_SHIPPING_THRESHOLD, BANK_TRANSFER_DISCOUNT } from './constants';

export const calcDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
};

export const calcShipping = (subtotal) => {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
};

export const calcCartTotal = (items) => {
    return items.reduce((sum, item) => {
        const finalPrice = calcDiscountedPrice(item.price, item.discount);
        return sum + finalPrice * item.quantity;
    }, 0);
};

export const applyPaymentDiscount = (total, method) => {
    if (method === 'bank') {
        return total - (total * BANK_TRANSFER_DISCOUNT) / 100;
    }
    return total;
};

export const applyCoupon = (total, coupon) => {
    if (!coupon || !coupon.active) return total;
    return total - (total * coupon.discount) / 100;
};

export const formatPrice = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};
