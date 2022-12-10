import * as express from 'express';
import api from './api'
const router = express.Router();


router.use('/api', api);
router.get('/', (req, res) => { })


export default router
