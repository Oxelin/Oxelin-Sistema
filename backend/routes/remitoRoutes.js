// routes/remitoRoutes.js
const express = require("express");
const router = express.Router();
const remitoController = require("../controllers/remitoController");

router.post("/", remitoController.crearRemito);
router.get("/", remitoController.obtenerRemitos);
router.delete("/:id", remitoController.eliminarRemito);

module.exports = router;
