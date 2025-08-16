const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); // ✅ Asegúrate que el nombre del archivo sea productRoutes.js
app.use('/api/clientes', require('./routes/clientRoutes'));
app.use('/api/remitos', require('./routes/remitoRoutes'));

// MongoDB URI
const mongoURI =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGO_URI_ATLAS
    : process.env.MONGO_URI_LOCAL;

// Conexión y arranque
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log('Error de conexión a MongoDB:', err));
