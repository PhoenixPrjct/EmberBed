import express, {Request, Response} from "express";
import { GC, UC } from '../../controllers'
const router = express.Router();

router.get("/", (req:Request, res:Response) => {
    res.status(200).send({ message: "User Routes" });
})

router.get("/nft/collection/:tokenMint", async (req:Request, res:Response) => {
    const tokenMint = req.params.tokenMint;
    const { status, response } = await GC.searchHashlistForNftCollection(tokenMint);
    console.log({ status, response })
    res.status(status).json(response);

});
router.use((req:Request, res:Response) => {
    res.status(404).end();
});

export default router;