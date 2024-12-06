import { Router } from 'express';
import { saveDetection, getDetectionHistory } from '../controllers/detection.controller';

const router = Router();

router.post('/api/save-detection', saveDetection);
router.get('/api/detection-history', getDetectionHistory);

export default router; 