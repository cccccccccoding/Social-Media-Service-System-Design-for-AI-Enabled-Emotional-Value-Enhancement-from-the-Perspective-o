import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clustersDir = path.join(__dirname, 'public', 'cluster-assets');
const configFile = path.join(clustersDir, 'config.json');

const scanClustersFolder = (reset = false) => {
  try {
    if (reset) {
      // 重置为默认光晕
      const clusters = [{
        name: "默认光晕",
        style: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",
        blur: 12,
        opacity: 0.6
      }];
      
      const config = { clusters };
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
      
      console.log('✅ 已重置为默认光晕！');
      console.log('资源列表:', clusters);
      
      return clusters;
    }
    
    const files = fs.readdirSync(clustersDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext) && 
             file !== 'config.json' && 
             file !== 'README.md';
    });
    
    const clusters = imageFiles.map(file => ({
      type: 'image',
      path: `/cluster-assets/${file}`,
      name: file
    }));
    
    // 添加默认渐变样式作为后备
    if (clusters.length === 0) {
      clusters.push({
        name: "默认光晕",
        style: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)",
        blur: 12,
        opacity: 0.6
      });
    }
    
    const config = { clusters };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    
    console.log(`✅ 扫描完成！找到 ${clusters.length} 个视觉资源`);
    console.log('资源列表:', clusters);
    
    return clusters;
  } catch (error) {
    console.error('❌ 扫描失败:', error);
    return [];
  }
};

// 检查命令行参数
const reset = process.argv.includes('--reset');
scanClustersFolder(reset);
