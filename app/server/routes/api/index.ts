import express from "express";
import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'
import collectionRoutes from './collectionRoutes'
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({ message: "Hello World!" });
})
router.use('/user', userRoutes);
router.use('/collection', collectionRoutes);
router.use('/admin', adminRoutes);

router.use((req, res) => {
    res.status(404).end();
});

export default router;