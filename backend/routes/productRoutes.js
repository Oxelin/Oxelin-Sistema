const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Crear producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const saved = await nuevoProducto.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Editar producto
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
