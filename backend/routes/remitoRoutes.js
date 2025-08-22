const express = require("express");
const router = express.Router();
const remitoController = require("../controllers/remitoController");

// Rutas de remitos
router.post("/", remitoController.crearRemito);
router.get("/", remitoController.obtenerRemitos);
router.delete("/:id", remitoController.eliminarRemito);

// Nueva ruta de costos
router.get("/costos", remitoController.obtenerCostos);

module.exports = router;
