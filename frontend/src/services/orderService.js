/**
 * orderService.js
 * Clean public API for order operations.
 * Delegates to the detailed api/orders.js implementation.
 */

export {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from './api/orders';
