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
      .populate('cliente', 'nombre tipo')
      .populate('productos.producto')
      .lean();

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

// 🔹 NUEVA FUNCIÓN: calcular costos con filtros
exports.obtenerCostos = async (req, res) => {
  try {
    const { clienteId, fechaInicio, fechaFin } = req.query; // vienen de la URL

    // Armamos el filtro dinámico
    let filtro = {};

    if (clienteId) {
      filtro.cliente = clienteId;
    }

    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    const remitos = await Remito.find(filtro)
      .populate("cliente", "nombre")
      .populate("productos.producto", "nombre costo");

    let totalCostos = 0;

    const remitosConCostos = remitos.map((r) => {
      const totalCostoRemito = r.productos.reduce((acc, p) => {
        return acc + (p.producto?.costo || 0) * p.cantidad;
      }, 0);

      totalCostos += totalCostoRemito;

      return {
        _id: r._id,
        cliente: r.cliente?.nombre || "Sin cliente",
        fecha: r.fecha,
        totalCosto: totalCostoRemito,
      };
    });

    res.json({ totalCostos, remitos: remitosConCostos });
  } catch (err) {
    console.error("Error al calcular costos:", err);
    res.status(500).json({ error: err.message });
  }
};

