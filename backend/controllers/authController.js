// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generarToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existe = await User.findOne({ username });
    if (existe) return res.status(400).json({ msg: 'Usuario ya existe' });

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ token: generarToken(user) });
  } catch (err) {
    res.status(500).json({ msg: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ msg: 'Credenciales inválidas' });

    res.status(200).json({ token: generarToken(user) });
  } catch (err) {
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
};
