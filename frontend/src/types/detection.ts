// API 响应的接口
export interface DetectionResponse {
  success: boolean;
  image_url: string;
  detections: Array<Array<{
    bbox: number[];  // [x1, y1, x2, y2, angle]
    score: number;
  }>>;
}

// 单个检测结果的接口
export interface Detection {
  label: string;
  bbox: [number, number, number, number, number];  // 包含旋转角度
}

// 整体检测结果的接口
export interface DetectionResult {
  detections: Detection[];
  resultImage: string;
  processingTime: number;
}