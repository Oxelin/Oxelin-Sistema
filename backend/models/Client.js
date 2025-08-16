const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['Consumidor Final', 'Revendedor'], required: true },
  telefono: { type: String },
  ubicacion: { type: String },
});

module.exports = mongoose.model('Client', clientSchema);
