import * as express from 'express';
import api from './api'
const router = express.Router();


router.use('/api', api);
router.get('/test', (req, res) => {
    res.status(200).json({ success: 'Connected to EmberBed Server' })
})
// router.get('/', (req, res) => { })


export default router
