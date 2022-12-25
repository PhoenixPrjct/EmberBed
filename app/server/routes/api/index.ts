import express from "express";
// import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'
import collectionRoutes from './collectionRoutes'
import { GC } from "../../controllers";
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




router.use('/user', userRoutes);
router.use('/collection', collectionRoutes);
// router.use('/admin', adminRoutes);

router.use((req, res) => {
    res.status(404).end();
});

export default router;