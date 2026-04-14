export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
};

export const truncateText = (text, length = 80) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getInitials = (name = '') => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const generateOrderId = () => {
    return 'TG-' + Date.now().toString(36).toUpperCase();
};

export const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
