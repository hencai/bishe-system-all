export interface DetectionHistory {
  id: number;
  originalImage: string;
  resultImage: string;
  detectionCount: number;
  createdAt: string;
}

export interface CreateHistoryRequest {
  originalImage: string;
  resultImage: string;
  detectionCount: number;
}
