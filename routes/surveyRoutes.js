const express = require("express");
const router = express.Router();
const { getAllSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey } = require("../controllers/surveyController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");

router.get("/", protect, getAllSurveys);
router.get("/:id", protect, getSurveyById);
router.post("/", protect, requireRole("officer", "admin"), createSurvey);
router.put("/:id", protect, requireRole("officer", "admin"), updateSurvey);
router.delete("/:id", protect, requireRole("admin"), deleteSurvey);

module.exports = router;
