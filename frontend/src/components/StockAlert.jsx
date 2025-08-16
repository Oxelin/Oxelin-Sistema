// 📁 src/components/StockAlert.jsx
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const StockAlert = ({ products }) => {
  useEffect(() => {
    products.forEach(product => {
      if (product.stock < 5) {
        toast.warn(`Stock bajo: ${product.name}`);
      }
    });
  }, [products]);

  return null;
};

export default StockAlert;