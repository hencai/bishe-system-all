const Detection = require('../models/detection');

exports.createDetection = async (req, res) => {
  try {
    const detection = await Detection.create({
      ...req.body,
      UserId: req.user.id
    });

    res.status(201).json({
      success: true,
      detection
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getDetections = async (req, res) => {
  try {
    const detections = await Detection.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      detections
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { detectionId } = req.params;
    const detection = await Detection.findOne({
      where: {
        id: detectionId,
        UserId: req.user.id
      }
    });

    if (!detection) {
      throw new Error('检测记录不存在');
    }

    // 这里添加生成报告的逻辑
    const reportData = {
      // 报告数据结构
    };

    await detection.update({
      reportUrl: 'report_url_here',
      analysisData: reportData
    });

    res.json({
      success: true,
      report: reportData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};