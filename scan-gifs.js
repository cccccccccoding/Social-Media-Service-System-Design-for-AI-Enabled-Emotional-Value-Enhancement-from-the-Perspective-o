import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gifsDir = path.join(__dirname, 'public', 'gifs');
const configFile = path.join(gifsDir, 'config.json');

const scanGifsFolder = () => {
  try {
    const files = fs.readdirSync(gifsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.gif', '.png', '.jpg', '.jpeg', '.webp'].includes(ext) && 
             file !== 'config.json' && 
             file !== 'README.md';
    });
    
    const gifs = imageFiles.map(file => `/gifs/${file}`);
    
    const config = { gifs };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    
    console.log(`✅ 扫描完成！找到 ${gifs.length} 个动图`);
    console.log('动图列表:', gifs);
    
    return gifs;
  } catch (error) {
    console.error('❌ 扫描失败:', error);
    return [];
  }
};

scanGifsFolder();
