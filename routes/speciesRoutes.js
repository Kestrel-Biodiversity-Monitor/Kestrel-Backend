const express = require("express");
const router = express.Router();
const { getSpecies, getSpeciesById, createSpecies, updateSpecies, deleteSpecies } = require("../controllers/speciesController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");
const upload = require("../middlewares/upload");

router.get("/", getSpecies);
router.get("/:id", getSpeciesById);
router.post("/", protect, requireRole("admin", "researcher"), upload.single("image"), createSpecies);
router.put("/:id", protect, requireRole("admin"), updateSpecies);
router.delete("/:id", protect, requireRole("admin"), deleteSpecies);

module.exports = router;
