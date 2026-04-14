const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

// 扫描gifs文件夹
const scanGifsFolder = () => {
  const gifsDir = path.join(__dirname, 'public', 'gifs');
  const configFile = path.join(gifsDir, 'config.json');
  
  try {
    const files = fs.readdirSync(gifsDir);
    const gifFiles = files.filter(file => 
      file.endsWith('.gif') && file !== 'config.json' && file !== 'README.md'
    );
    
    const gifs = gifFiles.map(file => `/gifs/${file}`);
    
    const config = { gifs };
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    
    console.log(`✅ 扫描完成！找到 ${gifs.length} 个动图`);
    return { count: gifs.length, gifs };
  } catch (error) {
    console.error('❌ 扫描失败:', error);
    return { count: 0, gifs: [], error: error.message };
  }
};

// API端点
app.post('/api/scan-gifs', (req, res) => {
  const result = scanGifsFolder();
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 API服务器运行在 http://localhost:${PORT}`);
  console.log('📝 使用方法：点击界面上的"刷新动图"按钮');
});
