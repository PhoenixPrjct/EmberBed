import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "Hello World!" });
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;