import express from "express";
import { UC } from '../../controllers'
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "User Routes" });
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;