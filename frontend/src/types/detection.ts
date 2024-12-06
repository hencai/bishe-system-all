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
  bbox: number[];
  score: number;
  category: string;
  label: string;
}

// 整体检测结果的接口
export interface DetectionResult {
  taskId: string;
  status: string;
  result_image?: string;
  resultImage?: string;
  detections: Detection[];
  processingTime: number;
  detected_objects?: Array<{
    bbox: number[];
    score: number;
    category: string;
  }>;
}