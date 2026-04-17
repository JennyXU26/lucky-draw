const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
// 解析 JSON 请求体
app.use(express.json());
// 托管 public 文件夹下的静态页面
app.use(express.static('public')); 

const dataPath = path.join(__dirname, 'data.json');

// API 1: 获取当前名单
app.get('/api/candidates', (req, res) => {
    if (!fs.existsSync(dataPath)) {
        return res.json([]); // 文件不存在则返回空数组
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(data));
});

// API 2: 同步更新名单（全量覆盖）
app.post('/api/candidates', (req, res) => {
    const { candidates } = req.body;
    if (!Array.isArray(candidates)) {
        return res.status(400).json({ error: '数据格式错误' });
    }
    // 将最新的数组写入 data.json 进行持久化
    fs.writeFileSync(dataPath, JSON.stringify(candidates), 'utf8');
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
});