import axios from 'axios';
import { DetectionHistory, CreateHistoryRequest } from '../types/history';
import { handleApiError } from '../utils/error';

const API_URL = process.env.REACT_APP_DETECTION_API_URL;

// 创建带有认证token的axios实例
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getDetectionHistory = async (): Promise<DetectionHistory[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/history`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const createDetectionHistory = async (data: CreateHistoryRequest): Promise<DetectionHistory | null> => {
  try {
    const response = await axios.post(`${API_URL}/api/history`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const deleteDetectionHistory = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/api/history/${id}`, getAuthHeaders());
    return true;
  } catch (error) {
    handleApiError(error);
    return false;
  }
};