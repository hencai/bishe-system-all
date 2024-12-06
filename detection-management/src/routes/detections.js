const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detectionController');
const auth = require('../middleware/auth');

router.use(auth); // 保护所有检测相关路由

router.post('/', detectionController.createDetection);
router.get('/', detectionController.getDetections);
router.post('/:detectionId/report', detectionController.generateReport);

module.exports = router;