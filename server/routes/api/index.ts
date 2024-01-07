import express, { Request, Response } from "express";
// import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'
import collectionRoutes from './collectionRoutes'
import { GC } from "../../controllers";
// import { PhoenixRelation, PhoenixRelationKind } from "../../app/src/types";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).send({ message: "Hello World!" });
})

router.get('/relations', async (req: Request, res: Response) => {
    try {
        console.log('Relations Endpoint')
        const { status, response } = await GC.getRelations();
        res.status(status).json(response)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
})

router.post('/relations/update', async (req: Request, res: Response) => {
    const { status, response } = await GC.updateRelations({ ...req.body })
    res.status(status).json(response)
})
router.post('/relations/update/bulk', async (req: Request, res: Response) => {
    const { auth, updates } = req.body;
    const { status, response } = await GC.updateRelationsBulk(auth, updates)

    res.status(status).json(response);
});

router.post('/relations/remove', async (req: Request, res: Response) => {
    const { auth, address } = req.body
    const { status, response } = await GC.removeRelations(auth, address)
    res.status(status).json(response)
})



router.use('/user', userRoutes);
router.use('/collection', collectionRoutes);
// router.use('/admin', adminRoutes);

router.use((req: Request, res: Response) => {
    res.status(404).end();
});

export default router;