import { AC } from "../../controllers";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "Admin Routes" });
})
router.get('/info/:wallet', async (req, res) => {
    try {

        console.log(req.params)
        const { wallet } = req.params
        const { status, response } = await AC.getDBAcct(wallet)
        res.status(status).json(response)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

})
router.get('/relations', async (req, res) => {
    try {
        const { status, response } = await AC.getRelations();
        res.status(status).json(response)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;