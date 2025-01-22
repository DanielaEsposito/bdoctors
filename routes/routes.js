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
//Update
router.put("/:id", Controller.update);
//Modify
router.patch("/:id", Controller.modify);
//Delete
router.delete("/:id", Controller.destroy);

module.exports = router;
