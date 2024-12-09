interface Detection {
  class_name: string;
  bbox: number[];
  score: number;
}

interface CategoryCount {
  name: string;      // 类别名称
  count: number;     // 该类别的目标数量
}

interface DetectionSummary {
  totalCategories: number;           // 总类别数
  totalObjects: number;              // 总目标数
  categories: CategoryCount[];       // 各类别统计
  rawDetections: Detection[];        // 原始检测数据
}

/**
 * 调用检测 API 获取检测结果
 * @param file - 图片文件
 * @returns Promise<DetectionSummary> - 返回处理后的检测结果
 */
export const getDetectionResult = async (file: File): Promise<DetectionSummary> => {
  try {
    
    const response = await fetch('http://10.16.32.190:8080/predictions/test1', {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'application/octet-stream',
      }
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    const detections: Detection[] = await response.json();

    // 统计各类别数量
    const categoryMap = new Map<string, number>();
    detections.forEach(detection => {
      const count = categoryMap.get(detection.class_name) || 0;
      categoryMap.set(detection.class_name, count + 1);
    });

    // 转换为数组格式
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));

    const summary: DetectionSummary = {
      totalCategories: categoryMap.size,
      totalObjects: detections.length,
      categories,
      rawDetections: detections
    };

    return summary;
    
  } catch (error) {
    console.error('请求失败:', {
      error,
      message: error instanceof Error ? error.message : '未知错误'
    });
    
    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error('请确保已启用 CORS Unblock 扩展');
    }
    
    throw error;
  }
};
