
import { Admin, Collection, User } from '../../models'
import express from "express";
import { CC } from '../../controllers';
const router = express.Router();


router.get("/", async (req, res) => {
    const response = await Collection.find();
    res.status(200).send(response);
})

router.get("/:wallet", async (req, res) => {
    const { wallet } = req.params;
    const { status, response } = await CC.getByOwner(wallet)
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;