/**
 * productService.js
 * Clean public API for product operations.
 * Delegates to the detailed api/products.js implementation.
 */

export {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api/products';
