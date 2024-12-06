import { message } from 'antd';
import axios from 'axios';

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.detail || error.message;
    message.error(`请求失败: ${errorMessage}`);
  } else if (error instanceof Error) {
    message.error(`操作失败: ${error.message}`);
  } else {
    message.error('操作失败，请稍后重试');
  }
  console.error('Error:', error);
};
