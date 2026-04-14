export const SITE_NAME = 'The Glases';
export const TAGLINE = 'See the World in Style.';

export const FREE_SHIPPING_THRESHOLD = 2000;
export const BANK_TRANSFER_DISCOUNT = 10;
export const RETURN_POLICY_DAYS = 7;

export const PAYMENT_METHODS = {
    COD: 'cod',
    BANK: 'bank',
    STRIPE: 'stripe',
    EASYPAISA: 'easypaisa',
    JAZZCASH: 'jazzcash',
};

export const ORDER_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

export const CATEGORIES = [
    { label: 'All', value: '' },
    { label: 'Blue Light', value: 'Blue Light' },
    { label: 'Sunglasses', value: 'Sunglasses' },
    { label: 'Aviators', value: 'Aviators' },
    { label: 'Fashion', value: 'Fashion' },
    { label: 'UV Protection', value: 'UV Protection' },
];

export const MOCK_PRODUCTS = [
    { id: '1', name: 'Clear Blue Pro', category: 'Blue Light', price: 2500, discount: 0, image_url: '/images/bluelight.png', is_featured: true },
    { id: '2', name: 'Midnight Aviator', category: 'Sunglasses', price: 3200, discount: 10, image_url: '/images/hero_glasses.png', is_featured: true },
    { id: '3', name: 'Classic Round', category: 'Fashion', price: 1800, discount: 0, image_url: '/images/round.png', is_featured: true },
    { id: '4', name: 'Urban Edge', category: 'UV Protection', price: 2800, discount: 5, image_url: '/images/sunglasses.png', is_featured: true },
    { id: '5', name: 'Gold Aviator', category: 'Aviators', price: 3500, discount: 0, image_url: '/images/hero_glasses.png', is_featured: true },
    { id: '6', name: 'Cat Eye Rose', category: 'Fashion', price: 2200, discount: 0, image_url: '/images/fashion.png', is_featured: false },
];
