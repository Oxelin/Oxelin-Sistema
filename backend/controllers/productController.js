// controllers/productController.js
const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const productos = await Product.find();
  res.json(productos);
};

exports.createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    if (req.file) {
      nuevoProducto.imagen = req.file.filename;
    }
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ msg: 'Error al crear producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ msg: 'Error al actualizar producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ msg: 'Error al eliminar producto' });
  }
};
