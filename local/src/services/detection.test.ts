import { getDetectionResult } from './detection';
import fs from 'fs';
import path from 'path';

/**
 * 测试检测服务
 */
async function testDetectionService() {
  try {
    // 读取指定路径的图片
    const imagePath = '/Users/luckybai/原型系统/系统开发/cursor项目/cursor-biye-1.0/local/storage/uploads/1733732953011-52436110.jpg';
    const imageBuffer = fs.readFileSync(imagePath);
    const file = new File([imageBuffer], '1733732953011-52436110.jpg', { type: 'image/jpeg' });

    // 调用检测服务
    console.log('开始检测...');
    const result = await getDetectionResult(file);

    // 打印结果
    console.log('\n检测结果统计:');
    console.log(JSON.stringify(result, null, 2));

    // 详细信息
    console.log('\n详细信息:');
    console.log(`总类别数: ${result.totalCategories}`);
    console.log(`总目标数: ${result.totalObjects}`);
    console.log('\n各类别统计:');
    result.categories.forEach(cat => {
      console.log(`${cat.name}: ${cat.count}个`);
    });

  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testDetectionService(); 