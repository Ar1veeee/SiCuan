"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Tes API untuk memastikan server berjalan
router.get("/api", (req, res) => {
    res.status(200).json({ message: "Test API is working!" });
});
exports.default = router;
