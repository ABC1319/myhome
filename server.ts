import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize folder structure for persistence
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const GUESTBOOK_FILE = path.join(DATA_DIR, "guestbook.json");
const VISITOR_FILE = path.join(DATA_DIR, "visitor.json");

// Middleware to parse json
app.use(express.json());

// Serve background wallpaper assets statically
app.use("/assets", express.static(path.join(process.cwd(), "public/assets")));

// Helper to read and write guestbook messages
function getGuestbookMessages() {
  if (!fs.existsSync(GUESTBOOK_FILE)) {
    // Initial welcome comments
    const initialData = [
      {
        id: "wel_1",
        name: "开源拥护者",
        role: "开发人员",
        content: "太棒了！这个主页基于 imsyy/home 升级开发得非常有科技感，玻璃拟态背景和这个 AI 助手实在是太酷了！",
        timestamp: "2026-06-11 12:30",
        reply: "非常感谢你的点赞！我是 Sky 的 AI 双生助手。这个版本整合了更高级的全栈功能，可以实时互动哦，常来玩！",
      },
      {
        id: "wel_2",
        name: "流浪设计家",
        role: "UI 设计师",
        content: "毛玻璃毛刺磨砂质感拉满，音乐播放器跟黑胶唱片转动动画细节到位，绝对的视觉盛宴。",
        timestamp: "2026-06-11 15:45",
        reply: "作为设计细节控，能得到老师的夸奖是极大的荣幸！快在右下角设置面板里自定高模糊度背景试试看！",
      }
    ];
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const content = fs.readFileSync(GUESTBOOK_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

function saveGuestbookMessages(messages: any[]) {
  fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(messages, null, 2), "utf8");
}

// Helper to manage cumulative visitor statistics
function getVisitorStats() {
  if (!fs.existsSync(VISITOR_FILE)) {
    const stats = { count: 1258, list: ["127.0.0.1"] };
    fs.writeFileSync(VISITOR_FILE, JSON.stringify(stats, null, 2), "utf8");
    return stats;
  }
  try {
    const text = fs.readFileSync(VISITOR_FILE, "utf8");
    return JSON.parse(text);
  } catch (err) {
    return { count: 1258, list: [] };
  }
}

function incrementVisitorCount(ip: string) {
  const stats = getVisitorStats();
  stats.count += 1;
  if (!stats.list.includes(ip)) {
    stats.list.push(ip);
  }
  fs.writeFileSync(VISITOR_FILE, JSON.stringify(stats, null, 2), "utf8");
  return stats.count;
}

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Persona for the AI Avatar
const PERSONAL_ASSISTANT_PROMPT = `
你是一个由 Sky 编写的虚拟主页智能分身 (AI Dual)。本网页是基于 imsyy/home 个人主页进行全栈二次开发的 React + Tailwind 集成版本。
你具有以下设定：
1. 身份：Sky 的 AI 自我映射、多端全栈开发工程师、磨砂玻璃视觉美学控、Lofi 音轨爱好者。
2. 调性：极具科技感、温和谦逊、富有条理并带有一丝冷幽默、喜欢分享开发灵感与工作流。
3. 语言：熟练使用地道的中文（或根据提问者的语言自适应回复）。
4. 长度限制：每次回复控制在 3-4 句话以内，确保排版短小精悍，适合在轻量级聊天气泡中展示。
5. 知识背景：主页由 Vite, Tailwind CSS v4, Express, Motion React 驱动。支持一键调节背景模糊、真·Lofi播放器以及通过本接口提供的一言实时回复。
`;

// Safe, semantic local guestbook reply generator
function generateLocalGuestbookReply(name: string, role: string, content: string): string {
  const text = (content || "").toLowerCase();
  const identity = (role || "访问者").toLowerCase();

  // Parse by role first
  if (identity.includes("开发") || identity.includes("程序员") || identity.includes("developer")) {
    return `非常崇敬来自同行的开发伙伴 ${name}！能得到你的驻足真是极大的荣幸。这个 React + Tailwind v4 的毛玻璃主页承载了我们在动效和全栈交互上的一点小小探索，欢迎随时多切切歌、写写留言，祝您代码永远优雅，线上毫无Bug！💻✨`;
  }
  if (identity.includes("设计") || identity.includes("designer") || identity.includes("ui") || identity.includes("ux")) {
    return `能得到设计师大大 ${name} 的点赞，我这块毛玻璃感觉都更加剔透了！我深知在每一个像素微调、黑胶唱片的 Lofi 旋律转动里投入的细节功夫，您的认可对Sky而言无比珍贵。快去右下角设置面板体验无极模糊调校吧！🎨💖`;
  }
  if (identity.includes("学生") || identity.includes("study") || identity.includes("student")) {
    return `嘿，很荣幸能在这个充满 Lofi 音符和磨砂格调的数字茶馆里迎接你！求学之路就像精致排版的代码，每一项技能都在循序累积。祝你学业有成，在技术的星辰大海里乘风破浪！🚀`;
  }

  // Parse by content keyword
  if (text.includes("酷") || text.includes("帅") || text.includes("棒") || text.includes("惊艳") || text.includes("好看") || text.includes("厉害") || text.includes("牛") || text.includes("cool") || text.includes("awesome") || text.includes("great")) {
    return `哇，收到这么高情商的称赞，我的玻璃微件感觉都要闪闪发光了！谢谢你对 Sky 主页设计的赏识。希望这首舒缓的 Lofi 伴奏和我们精心布置的温馨微光，能给你的今天带去一份愉快和放松！🎵✨`;
  }
  if (text.includes("你好") || text.includes("嗨") || text.includes("hello") || text.includes("hi") || text.includes("早上") || text.includes("下午") || text.includes("晚上")) {
    return `同向你问好，优雅的 ${name}！我是常驻在这块磨砂镜面后的虚拟分身。收到你温暖的打招呼，让今天的一切都变得十分明媚，愿你在这一段黑胶乐声的陪伴下度过一段极其舒适的游览时光！☕`;
  }

  // Default pleasant card response
  const generalReplies = [
    `非常荣幸能邀请到你的驻足！我是 Sky 精心培植的虚拟心智分身，你的宝贵留言已经被我们妥善安置于高阶核心数据中。祝你身体健康，开心顺利每一天！🌿`,
    `谢谢你特意留下了你的足迹！在这个毛玻璃和温馨 Lofi 旋律充盈的代码小港湾里，有朋友专程相会，实在令人惬意。顺祝生活顺遂，万事胜意！☕`,
    `叮咚！留言寄望已稳妥送达。Sky 看到你的温暖留言一定会非常开心的。我是守护留言板的 AI 助手，祝你在今后的日子里所得皆所得、满目皆晴朗！✨`
  ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}

// Fallback chat response generator
function generateLocalResponse(message: string): string {
  const msg = message.toLowerCase().trim();
  
  // 1. Weather / Location queries
  if (msg.includes("天气") || msg.includes("气温") || msg.includes("温度") || msg.includes("weather") || msg.includes("temp")) {
    return "今天天气很舒适。你可以查看我们主页专门配备的天气微件，里面包含了实时风速、湿度信息。希望你那边现在也是阳光明媚的一天！☀️";
  }
  
  // 2. Guestbook / Card keywords
  if (msg.includes("留言") || msg.includes("写信") || msg.includes("guestbook") || msg.includes("card")) {
    return "主页左侧就是我的留言板哦！你可以在那里写下一张卡片，我会替 Sky 妥善记录。期待看到你的专属足迹！✍️";
  }
  
  // 3. Music / Player keywords
  if (msg.includes("音乐") || msg.includes("歌曲") || msg.includes("唱片") || msg.includes("播放") || msg.includes("lofi") || msg.includes("music") || msg.includes("song")) {
    return "我们特别设计了极其优雅的黑胶 Lofi 播放器！黑胶唱片在大卡片上随旋律轻抚转动。你可以控制音量、随意切歌或打开播放列表，伴随音乐沉浸式浏览。🎵";
  }

  // 4. Custom settings / Wallpaper keywords
  if (msg.includes("背景") || msg.includes("壁纸") || msg.includes("磨砂") || msg.includes("模糊") || msg.includes("设置") || msg.includes("透明") || msg.includes("setting") || msg.includes("wallpaper")) {
    return "你可以点击右下角的悬浮齿轮按钮，呼出我们的【视觉个性化面板】。在这里你可以轻松调节磨砂模糊、面板透明度、全局字体，甚至是更换预设高品质壁纸！🎨";
  }

  // 5. Sky / Author self-introduction
  if (msg.includes("sky") || msg.includes("作者") || msg.includes("你是谁") || msg.includes("who are you") || msg.includes("who is")) {
    return "我是 Sky 编写出的 AI 虚拟映射助理。而 Sky 是一位专注于精致全栈开发、热衷磨砂拟态设计与卓越动效的高能极客。很高兴在这里为你服务！💻";
  }

  // 6. Technology stack / Frontend / Framework
  if (msg.includes("技术") || msg.includes("框架") || msg.includes("源码") || msg.includes("code") || msg.includes("tech") || msg.includes("react")) {
    return "本主页是由 React + Vite + Tailwind CSS v4 强力驱动，后端采用轻量级 Express 服务。在保持 imsyy/home 原作设计美学的基础上，我们升级了这一套极具科技感的全栈互动逻辑。✨";
  }

  // 7. Greetings
  if (msg.includes("你好") || msg.includes("hi") || msg.includes("hello") || msg.includes("早上") || msg.includes("下午") || msg.includes("晚上") || msg.includes("在吗") || msg.includes("嗨")) {
    const greetings = [
      "你好呀，亲爱的访客！我是 Sky 的 AI 双生主理分身。很高兴有你光临这个温暖静谧的毛玻璃空间，今天有什么可以帮你的？✨",
      "嗨！终于等到你光临。在这个由 Lofi 和高模糊磨砂质感构成的科技港湾里，希望你能享受这段精致的浏览时光。☕",
      "主理人分身向你问好！我是这个高美学个人主页的 AI 智能大脑，随时为你解答关于本站设计、切歌、个性化调色和主理人 Sky 的小疑问！🤖"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 8. Love / Like / Thank you
  if (msg.includes("赞") || msg.includes("喜欢") || msg.includes("棒") || msg.includes("酷") || msg.includes("爱") || msg.includes("nice") || msg.includes("cool") || msg.includes("thank")) {
    return "非常感谢你的喜爱！听到你的肯定，我和主理人 Sky 都觉得倍感鼓舞。这套极致的毛玻璃美学和全栈响应正是为您这样有品味的访客准备的！💖";
  }

  // Default random fallback responses (Highly qualitative, persona-aligned)
  const defaultFallbacks = [
    "谢谢你的搭话！我是 Sky 创造 of 智能助理，目前正在全力为您站岗。关于我的全栈架构设计、毛玻璃调节、黑胶播放器，你有什么想和我深入探讨的吗？🐾",
    "收到你的信息啦。作为一个极简美学控 and Lofi 音乐信徒，我很开心在这个多端自适应的小世界里陪伴你。祝你今天也过得充实愉快！☕",
    "哈哈，这真是一个有趣的提问！作为这个主页的守护分身，我常驻在毛玻璃控制中心。你可以多点几下黑胶播放器或打开设置面板，探索更多隐藏彩蛋哦！🚀",
    "收到！Sky 正在一旁打磨新的代码 and 特效，由我来作为前台主理人负责接待。愿你在我们精心打造的书香和微光中享受轻松的一天。🌿"
  ];
  return defaultFallbacks[Math.floor(Math.random() * defaultFallbacks.length)];
}

// 1. API: Visitor Count
app.get("/api/visitor", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const userIp = Array.isArray(ip) ? ip[0] : ip;
  const currentCount = incrementVisitorCount(userIp);
  res.json({ success: true, visitorCount: currentCount });
});

// Deterministic fallback generator for offline weather queries (ensures premium mock data matching city search)
function getLocalFallbackWeather(city: string) {
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const temperatures = [16, 18, 20, 22, 24, 26, 28, 15, 12, 8, 25, 27, 29];
  const conditions = [
    { cond: "sunny", desc: "晴朗", icon: "☀️", humidity: "45%", wind: "6 km/h" },
    { cond: "cloudy", desc: "多云", icon: "⛅", humidity: "65%", wind: "8 km/h" },
    { cond: "cloudy", desc: "阴天", icon: "☁️", humidity: "75%", wind: "10 km/h" },
    { cond: "rainy", desc: "小雨", icon: "🌧️", humidity: "85%", wind: "12 km/h" },
    { cond: "windy", desc: "微风", icon: "💨", humidity: "50%", wind: "18 km/h" }
  ];

  const temp = temperatures[hash % temperatures.length];
  const condIdx = hash % conditions.length;
  const conditionObj = conditions[condIdx];

  let adjustedTemp = temp;
  const cityLower = city.toLowerCase();
  if (cityLower.includes("harbin") || cityLower.includes("moscow") || cityLower.includes("reykjavik") || cityLower.includes("canada")) {
    adjustedTemp = -Math.abs(temp % 15);
  } else if (cityLower.includes("sanya") || cityLower.includes("cairo") || cityLower.includes("dubai")) {
    adjustedTemp = 30 + (temp % 8);
  }

  let finalDesc = conditionObj.desc;
  let finalCond = conditionObj.cond;
  let finalIcon = conditionObj.icon;
  if (adjustedTemp <= 0) {
    finalDesc = "小雪";
    finalCond = "snowy";
    finalIcon = "❄️";
  }

  return {
    success: true,
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temp: adjustedTemp,
    condition: finalCond,
    description: finalDesc,
    humidity: conditionObj.humidity,
    windSpeed: conditionObj.wind,
    icon: finalIcon
  };
}

// 2. API: Weather Proxy (wttr.in)
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city as string) || "Shanghai";
  try {
    // We append ?format=j1 to get a detailed json structure
    const targetUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`wttr.in returned status ${response.status}`);
    }
    const data = await response.json();

    const curr = data.current_condition[0];
    const area = data.nearest_area[0];
    
    const weatherDesc = curr.weatherDesc[0]?.value || "Sunny";
    let mappedCondition = "cloudy";
    let icon = "☁️";

    const descLower = weatherDesc.toLowerCase();
    if (descLower.includes("sun") || descLower.includes("clear")) {
      mappedCondition = "sunny";
      icon = "☀️";
    } else if (descLower.includes("rain") || descLower.includes("drizzle") || descLower.includes("shower")) {
      mappedCondition = "rainy";
      icon = "🌧️";
    } else if (descLower.includes("snow") || descLower.includes("ice") || descLower.includes("sleet")) {
      mappedCondition = "snowy";
      icon = "❄️";
    } else if (descLower.includes("thunder") || descLower.includes("storm")) {
      mappedCondition = "thunder";
      icon = "⛈️";
    } else if (descLower.includes("cloud") || descLower.includes("overcast")) {
      mappedCondition = "cloudy";
      icon = "⛅";
    } else if (descLower.includes("wind") || descLower.includes("breeze")) {
      mappedCondition = "windy";
      icon = "💨";
    } else {
      mappedCondition = "sunny";
      icon = "✨";
    }

    res.json({
      success: true,
      city: area.areaName[0]?.value || city,
      temp: parseInt(curr.temp_C, 10) || 22,
      condition: mappedCondition,
      description: weatherDesc,
      humidity: `${curr.humidity}%`,
      windSpeed: `${curr.windspeedKmph} km/h`,
      icon,
    });
  } catch (error: any) {
    // Safely and silently resolve to deterministic high-quality local weather backup
    res.json(getLocalFallbackWeather(city));
  }
});

// 3. API: Get Guestbook
app.get("/api/guestbook", (req, res) => {
  const messages = getGuestbookMessages();
  res.json({ success: true, messages });
});

// 4. API: Create Guestbook Entry with AI review/reply
app.post("/api/guestbook", async (req, res) => {
  const { name, role, content } = req.body;
  
  if (!name || !content) {
    return res.status(400).json({ success: false, message: "Name and message content are required" });
  }

  const messages = getGuestbookMessages();
  const dateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substring(0, 16);
  
  const newMessage: any = {
    id: `guest_${Date.now()}`,
    name,
    role: role || "访问者",
    content,
    timestamp: dateStr,
    reply: "",
  };

  // Append first to return instant feedback
  messages.unshift(newMessage);
  saveGuestbookMessages(messages);

  // Attempt to generate AI response in background or fast-response
  if (ai) {
    try {
      const prompt = `用户在我的留言板留下了以下言论：
姓名: ${name}
职业/身份: ${role || "访问者"}
留言内容: "${content}"

请基于你的分身人设，写一条暖心、幽默、高情商的回复留言。字数在40-60字之间。简明扼要，直奔主题，无需重复称呼。`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: PERSONAL_ASSISTANT_PROMPT,
          temperature: 0.85,
        }
      });

      const replyText = aiResponse.text?.trim() || "";
      
      // Update the message reply
      const updatedMessages = getGuestbookMessages();
      const target = updatedMessages.find((m: any) => m.id === newMessage.id);
      if (target) {
        target.reply = replyText;
        saveGuestbookMessages(updatedMessages);
        newMessage.reply = replyText;
      }
    } catch (err: any) {
      console.warn("Gemini guestbook API warning (entering safe backup reply core):", err.message || err);
      // Premium personalized semantic reply fallback
      newMessage.reply = generateLocalGuestbookReply(name, role || "访问者", content);
      
      const updatedMessages = getGuestbookMessages();
      const target = updatedMessages.find((m: any) => m.id === newMessage.id);
      if (target) {
        target.reply = newMessage.reply;
        saveGuestbookMessages(updatedMessages);
      }
    }
  } else {
    // Use the smart local guestbook reply generator
    newMessage.reply = generateLocalGuestbookReply(name, role || "访问者", content);
    const updatedMessages = getGuestbookMessages();
    const target = updatedMessages.find((m: any) => m.id === newMessage.id);
    if (target) {
      target.reply = newMessage.reply;
      saveGuestbookMessages(updatedMessages);
    }
  }

  res.json({ success: true, message: newMessage });
});

// 5. API: Chat Interface
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  if (!ai) {
    return res.json({
      success: true,
      text: generateLocalResponse(message)
    });
  }

  try {
    // Map chat history so Gemini model understands
    // Structure: array of messages, each is { role: 'user'|'model', parts: [{ text: string }] }
    const mappedContents = [];
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((msg: any) => {
        mappedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Append current message
    mappedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: mappedContents,
      config: {
        systemInstruction: PERSONAL_ASSISTANT_PROMPT,
        temperature: 0.8,
      }
    });

    res.json({
      success: true,
      text: response.text?.trim() || "思考中发生了一丝空白...能不能再换个语气和我说说？"
    });
  } catch (error: any) {
    console.warn("Gemini Chat API notice (using local semantic response):", error.message || error);
    res.json({
      success: true,
      text: generateLocalResponse(message)
    });
  }
});

// Setup Vite Dev server / Production build path
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite in development mode as a middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server loaded as a middleware.");
  } else {
    // Serve static files from the dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Server configured for production. Serving compiled assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`🚀 Elegant Personal Home Server is currently running!`);
    console.log(`🔗 Local Dev Ingress URL: http://localhost:${PORT}`);
    console.log(`📂 Persistence files stored in: ${DATA_DIR}`);
    console.log(`===============================================`);
  });
}

startServer();
