import axios from 'axios';
import { DetectionResponse } from '../types/detection';

const DETECTION_API_URL = process.env.REACT_APP_DETECTION_API_URL;

if (!DETECTION_API_URL) {
  console.error('Detection API URL is not defined in environment variables');
}

export const detectObjects = async (file: File): Promise<DetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const apiUrl = `${DETECTION_API_URL}/api/detect`; // 修改为正确的端点
  console.log('Sending request to:', apiUrl);

  try {
    const response = await axios.post<DetectionResponse>(
      apiUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Detection request failed:', error);
    const errorMessage = error.response?.data?.detail || '检测请求失败';
    throw new Error(errorMessage);
  }
};