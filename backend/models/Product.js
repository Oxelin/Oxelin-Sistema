const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    precioConsumidorFinal: { type: Number, required: true },
    precioRevendedor: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
