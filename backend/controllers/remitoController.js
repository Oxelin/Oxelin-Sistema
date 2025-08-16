const Remito = require('../models/Remito');
const Cliente = require('../models/Client');
const Producto = require('../models/Product');

exports.crearRemito = async (req, res) => {
  try {
    const { cliente, productos, tipoPrecio } = req.body;

    const productosConSubtotal = productos.map(item => ({
      ...item,
      subtotal: item.cantidad * (item.precioUnitario ?? 0),
    }));

    const total = productosConSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    const nuevoRemito = new Remito({
      cliente,
      productos: productosConSubtotal.map(p => ({
        producto: p.producto,
        cantidad: p.cantidad,
        subtotal: p.subtotal,
      })),
      tipoPrecio,
      total,
    });

    await nuevoRemito.save();
    res.status(201).json(nuevoRemito);
  } catch (err) {
    console.error("Error al guardar remito:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.obtenerRemitos = async (req, res) => {
  try {
    const remitos = await Remito.find()
      .populate('cliente', 'nombre tipo') // Traemos solo lo necesario
      .populate('productos.producto')
      .lean(); // Convierte a objetos JS para poder modificar

    // Agregar tipoCliente como campo plano
    const remitosConTipo = remitos.map(r => ({
      ...r,
      tipoCliente: r.cliente.tipo
    }));

    res.json(remitosConTipo);
  } catch (err) {
    console.error("Error al obtener remitos:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.eliminarRemito = async (req, res) => {
  try {
    const { id } = req.params;
    await Remito.findByIdAndDelete(id);
    res.status(200).json({ message: 'Remito eliminado con éxito' });
  } catch (err) {
    console.error("Error al eliminar remito:", err);
    res.status(500).json({ error: err.message });
  }
};