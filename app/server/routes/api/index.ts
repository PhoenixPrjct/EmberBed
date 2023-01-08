import express from "express";
// import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'
import collectionRoutes from './collectionRoutes'
import { GC } from "../../controllers";
import { PhoenixRelation, PhoenixRelationKind } from "src/types";
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "Hello World!" });
})

router.get('/relations', async (req, res) => {
    try {
        console.log('Relations Endpoint')
        const { status, response } = await GC.getRelations();
        res.status(status).json(response)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.post('/relations/update', async (req, res) => {
    const { status, response } = await GC.updateRelations({ ...req.body })
    res.status(status).json(response)
})
router.post('/relations/update/bulk', async (req, res) => {
    const { auth, updates } = req.body;
    const { status, response } = await GC.updateRelationsBulk(auth, updates)

    res.status(status).json(response);
});

router.post('/relations/remove', async (req, res) => {
    const { auth, address } = req.body
    const { status, response } = await GC.removeRelations(auth, address)
    res.status(status).json(response)
})



router.use('/user', userRoutes);
router.use('/collection', collectionRoutes);
// router.use('/admin', adminRoutes);

router.use((req, res) => {
    res.status(404).end();
});

export default router;