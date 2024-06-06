const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problems.js");

router.get("/", (req, res) => {
    res.json({
        message: "This is problems API interface",
    });
});

router.post("/getProblems", problemController.getProblems);

module.exports = router; 