import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { getDetectionResult, getDetectionImageBase64 } from './detection';

// DOTA数据集的目标类别
const DOTA_CLASSES: Record<string, string> = {
  'plane': '飞机',
  'ship': '船舶',
  'storage-tank': '储存罐',
  'baseball-diamond': '棒球场',
  'tennis-court': '网球场',
  'basketball-court': '篮球场',
  'ground-track-field': '田径场',
  'harbor': '港口',
  'bridge': '桥梁',
  'large-vehicle': '大型车辆',
  'small-vehicle': '小型车辆',
  'helicopter': '直升机',
  'roundabout': '环岛',
  'soccer-ball-field': '足球场',
  'swimming-pool': '游泳池'
} as const;

interface DetectionResult {
  category: keyof typeof DOTA_CLASSES;
  bbox: number[];
  score: number;
}

interface AnalysisResult {
  facilityStats: Record<string, number>;
  transportDensity: number;
  publicFacilities: number;
  industrialDensity: number;
  suggestions: string[];
}

export class UrbanAnalysisService {
  static analyzeDetectionResults(
    detectionResults: DetectionResult[],
    imageWidth: number,
    imageHeight: number
  ): AnalysisResult {
    const area_total = imageWidth * imageHeight;

    // 统计各类设施数量
    const facilityStats: Record<string, number> = {};
    Object.keys(DOTA_CLASSES).forEach(key => {
      facilityStats[key] = detectionResults.filter(d => d.category === key).length;
    });

    // 计算交通设施密度
    const transport_facilities = ['bridge', 'roundabout', 'large-vehicle', 'small-vehicle'];
    const transportDensity = transport_facilities.reduce((sum, facility) =>
      sum + (facilityStats[facility] || 0), 0) / (area_total / 1000000);

    // 计算公共设施数量
    const public_facilities = [
      'baseball-diamond', 'tennis-court', 'basketball-court',
      'ground-track-field', 'soccer-ball-field', 'swimming-pool'
    ];
    const publicFacilities = public_facilities.reduce((sum, facility) =>
      sum + (facilityStats[facility] || 0), 0);

    // 计算工业设施密度
    const industrial_facilities = ['storage-tank', 'harbor'];
    const industrialDensity = industrial_facilities.reduce((sum, facility) =>
      sum + (facilityStats[facility] || 0), 0) / (area_total / 1000000);

    return {
      facilityStats,
      transportDensity: Number(transportDensity.toFixed(2)),
      publicFacilities,
      industrialDensity: Number(industrialDensity.toFixed(2)),
      suggestions: this.generateSuggestions(facilityStats, transportDensity, publicFacilities, industrialDensity)
    };
  }

  static generateSuggestions(
    facilityStats: Record<string, number>,
    transportDensity: number,
    publicFacilities: number,
    industrialDensity: number
  ): string[] {
    const suggestions: string[] = [];

    if (transportDensity < 5) {
      suggestions.push("建议加强区域交通基础设施建设，提高道路网络密度和互联互通性。");
    } else if (transportDensity > 15) {
      suggestions.push("区域交通设施密集，建议优化交通流量管理，考虑建设立体交通设施。");
    }

    if (publicFacilities < 3) {
      suggestions.push("区域公共运动设施较少，建议增加体育场地等公共设施的覆盖率。");
    } else if (publicFacilities > 10) {
      suggestions.push("公共设施分布充足，建议注意设施的维护和使用效率的提升。");
    }

    if (industrialDensity > 8) {
      suggestions.push("工业设施密度较高，建议关注环境影响评估，考虑增加绿化隔离带。");
    }

    if (facilityStats['harbor'] > 0) {
      suggestions.push("存在港口设施，建议优化港口物流通道，加强与城市交通系统的衔接。");
    }

    if (facilityStats['storage-tank'] > 5) {
      suggestions.push("储存设施集中，建议加强安全管理，建立完善应急响应机制。");
    }

    return suggestions;
  }

  static async generatePdfReport(
    analysisResult: AnalysisResult,
    originalImagePath: string,
    resultImagePath: string
  ): Promise<string> {
    const outputPath = path.join('storage', 'reports', `urban_analysis_${Date.now()}.pdf`);
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    // 读取原始图片并获取检测统计
    const imageBuffer = await fs.promises.readFile(originalImagePath);
    const imageFile = new File([imageBuffer], path.basename(originalImagePath), { type: 'image/jpeg' });
    const detectionStats = await getDetectionResult(imageFile);

    // 获取检测结果图片的 base64
    const detectionResultBase64 = await getDetectionImageBase64(imageFile);

    // 将原始图片转换为 base64
    const originalImageBase64 = fs.existsSync(originalImagePath)
      ? `data:image/jpeg;base64,${fs.readFileSync(originalImagePath, 'base64')}`
      : '';

    // 创建 HTML 内容
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: "PingFang SC", "Microsoft YaHei", sans-serif; 
              padding: 40px;
              line-height: 1.5;
            }
            .title { 
              font-size: 24px; 
              text-align: center; 
              margin-bottom: 30px; 
              font-weight: bold;
            }
            .section-title { 
              font-size: 18px; 
              margin-top: 20px; 
              margin-bottom: 10px;
              font-weight: bold;
            }
            .content { 
              font-size: 14px; 
              margin-bottom: 15px; 
              page-break-inside: avoid;
            }
            .image-container { 
              margin-top: 20px; 
              text-align: center; 
            }
            img { 
              max-width: 500px; 
              max-height: 300px; 
              margin: 10px auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              page-break-inside: avoid;
            }
            td, th {
              padding: 8px;
              border: 1px solid #ddd;
            }
            .detection-stats {
              margin: 20px 0;
              padding: 15px;
              background: #f5f5f5;
              border-radius: 4px;
              page-break-inside: avoid;
            }
            .stats-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .stats-item {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="title">城市遥感影像分析报告</div>
          
          <div class="section-title">本次分析图像:</div>
          <div class="image-container">
            <img src="${originalImageBase64}" alt="本次分析图像">
          </div>

          <div class="section-title">检测结果图像:</div>
          <div class="image-container">
            <img src="${detectionResultBase64}" alt="检测结果图像">
          </div>

          <div class="section-title">目标检测统计:</div>
          <div class="detection-stats">
            <div class="stats-item">检测目标总数：${detectionStats.totalObjects}</div>
            <div class="stats-item">检测类别总数：${detectionStats.totalCategories}</div>
            
            <div class="stats-title">类别详情:</div>
            <table>
              <tr>
                <th>类别名称</th>
                <th>数量</th>
              </tr>
              ${detectionStats.categories.map((cat: { name: string; count: number }) => `
                <tr>
                  <td>${cat.name}</td>
                  <td>${cat.count}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="section-title">关键指标分析:</div>
          <div class="content">
            <table>
              <tr>
                <td>交通设施密度</td>
                <td>${(analysisResult.transportDensity * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>公共设施数量</td>
                <td>${analysisResult.publicFacilities}</td>
              </tr>
              <tr>
                <td>工业设施密度</td>
                <td>${(analysisResult.industrialDensity * 100).toFixed(1)}%</td>
              </tr>
            </table>
          </div>

          <div class="section-title">规划建议:</div>
          <div class="content">
            <ul>
              ${analysisResult.suggestions.map(suggestion => `
                <li>${suggestion}</li>
              `).join('')}
            </ul>
          </div>

          <div class="content" style="margin-top: 30px; color: #666;">
            报告生成时间：${new Date().toLocaleString('zh-CN')}
          </div>
        </body>
      </html>
    `;

    try {
      // 启动浏览器
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // 生成 PDF
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true
      });

      await browser.close();
      return outputPath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }
}