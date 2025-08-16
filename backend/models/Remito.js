const mongoose = require("mongoose");

const remitoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      cantidad: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
  tipoPrecio: {
    type: String,
    enum: ["costo", "precioConsumidorFinal", "precioRevendedor"],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Remito", remitoSchema);
