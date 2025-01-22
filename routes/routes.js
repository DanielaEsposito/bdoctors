const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controllers");

//! LISTA ROTTE

// index
router.get("/", Controller.index);

// Show
router.get("/:id", Controller.show);

//Create
router.post("/", Controller.storeDoctor);

module.exports = router;
