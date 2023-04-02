
// import { Admin, Collection, User } from '../../models'
import express from "express";
import { CC } from '../../controllers';
const router = express.Router();


router.get("/", async (req, res) => {
    const { status, response } = await CC.getAll();
    res.status(status).send(response);
})

// router.get("/owner/:wallet", async (req, res) => {
//     const { wallet } = req.params;
//     const { status, response } = await CC.getByOwner(wallet);
//     res.status(status).send(response);
// })
router.post("/new", async (req, res) => {
    try {
        const { collection, manager, pda, reward_wallet, vca } = req.body;
        console.log(reward_wallet)
        const { status, response } = await CC.create({...req.body})
        res.status(status).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.post('/update', async (req, res) => {
    try {
        console.log('update')
        const { pda, wallet, data } = req.body
        const { status, response } = await CC.updateCollection(pda, wallet, data);
        res.status(status).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);

    }
})

router.post('/style/add', async (req, res) => {
    console.log('Adding Style')
    const { wallet, pda, style } = req.body;
    const { status, response } = await CC.addStyle(pda, wallet, style);
    res.status(status).send(response);

})

router.get('/hashlist/:pda', async (req, res) => {
    const { pda } = req.params;
    console.log(pda);
    const { status, response } = await CC.getHashlist(pda);
    res.status(status).send(response);
})
router.post('/hashlist/add', async (req, res) => {
    const { hashlist, wallet, name, pda } = req.body;
    const { status, response } = await CC.addHashlist(wallet, name, hashlist, pda)
    res.status(status).send(response);
})

router.get('/info/:pda', async (req, res) => {
    const { pda } = req.params;
    console.log(`Getting Info for ${pda}`)
    const { status, response } = await CC.getByPDA(pda)
    // console.log({ response })
    res.status(status).json(response)
})

router.delete("/:pda", async (req, res) => {
    const { status, response } = await CC.deleteByPDA(req.params.pda)
    res.status(status).send(response);
})

router.use((req, res) => {
    res.status(404).end();
});

export default router;