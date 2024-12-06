// 检测结果中的单个目标
export interface Detection {
  bbox: number[];     // 边界框坐标
  score: number;      // 置信度分数
}

// 处理后的检测结果（用于前端显示）
export interface ProcessedDetection {
  label: string;
  confidence: number;
  bbox: number[];
}

// 页面使用的检测结果类型
export interface DetectionResult {
  detections: ProcessedDetection[];
  resultImage: string;
  processingTime: number;
}

// FastAPI 响应格式
export interface DetectionResponse {
  success: boolean;
  image_url: string;  // 结果图片的URL
  detections: Detection[][];
}