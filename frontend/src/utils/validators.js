// 📁 src/utils/validators.js
export const validateProduct = (product) => {
  if (!product.name || !product.price) return false;
  return true;
};