import axios from 'axios';
import { DetectionResponse } from '../types/detection';

const DETECTION_API_URL = process.env.REACT_APP_DETECTION_API_URL;

export const detectObjects = async (file: File): Promise<DetectionResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${DETECTION_API_URL}/api/detect`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('检测请求错误:', error.response?.data);
    }
    throw error;
  }
};