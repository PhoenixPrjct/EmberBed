import * as express from 'express';
import { Request, Response } from 'express';
import api from './api'
const router = express.Router();


router.use('/api', api);
router.get('/test', (req: Request, res: Response) => {
    res.status(200).json({ success: 'Connected to EmberBed Server' })
})
// router.get('/', (req:Request, res:Response) => { })


export default router
