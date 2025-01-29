const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllers");

//! LISTA ROTTE

// index
router.get("/", Controller.index);
//index specialties
router.get("/specialties", Controller.indexSpecialties);
//index reviews
router.get("/reviews", Controller.indexReviews);

router.get("/provinces", Controller.indexProvinces);

// Show
router.get("/:id", Controller.show);
// Show
router.get("/:id/specialties", Controller.showFilteredDoctors);

//Create
router.post("/", Controller.storeDoctor);

//Create (review)
router.post("/:id/review", Controller.storeReview);

module.exports = router;
