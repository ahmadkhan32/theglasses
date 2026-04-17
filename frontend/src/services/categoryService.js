/**
 * categoryService.js
 * Clean public API for category operations.
 * Delegates to the detailed api/categories.js implementation.
 */

export {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from './api/categories';
