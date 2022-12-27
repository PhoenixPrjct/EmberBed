import express from "express";
import { GC, UC } from '../../controllers'
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "User Routes" });
})

router.get("/nft/collection/:tokenMint", async (req, res) => {
    const tokenMint = req.params.tokenMint;
    const { status, response } = await GC.searchForNftCollection(tokenMint);
    res.status(status).json(response);

});
router.use((req, res) => {
    res.status(404).end();
});

export default router;