
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
router.post("/new", async (req, res) => {
    try {
        const { sig, collection } = req.body;
        const { status, response } = await CC.create(sig, collection)
        res.status(status).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;