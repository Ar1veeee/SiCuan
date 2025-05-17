import { Router } from "express";

const router = Router();

// Tes API untuk memastikan server berjalan
router.get("/api", (req, res) => {
    res.status(200).json({ message: "Test API is working!" });
});

export default router;