const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.static("public"));

const filePath = "./names.json";

// 如果文件不存在，创建文件并初始化数据
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({
    names: ["yinen", "yimeng", "yokepek", "queenny", "kelly", "kokkeong", "tecklee", "cindy", "ahgu", "beyi", "quenny mama", "tete", "fiona", "cj", "earnqii", "weiyu"],
    drawn: []
  }));
}

// 获取首页（HTML页面）
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 执行抽奖操作
app.post("/draw", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const { names, drawn } = data;

  if (drawn.length >= names.length) {
    return res.json({ message: "所有名字已经抽完了！" });
  }

  // 获取未抽中的名字
  let availableNames = names.filter((name) => !drawn.includes(name));
  const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];

  drawn.push(randomName);
  fs.writeFileSync(filePath, JSON.stringify({ names, drawn }));

  res.json({ message: `你抽到了：${randomName}` });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
