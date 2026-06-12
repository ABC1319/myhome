import React, { useState, useEffect } from "react";
import { Quote, RefreshCw, Copy, Check } from "lucide-react";

export default function Hitokoto() {
  const [quote, setQuote] = useState("山川异域，日月同天。");
  const [author, setAuthor] = useState("《唐代日本长屋王赠赠诗》");
  const [category, setCategory] = useState("通用");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch a quote from Hitokoto API
  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      // Fetching from official Hitokoto API
      const res = await fetch("https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k");
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      
      setQuote(data.hitokoto);
      
      const fromWho = data.from_who ? data.from_who : "";
      const fromWork = data.from ? `《${data.from}》` : "";
      setAuthor(fromWho ? `${fromWho} · ${fromWork}` : fromWork || "未知作者");
      
      // Categorize
      const catMapping: Record<string, string> = {
        a: "动画", b: "漫画", c: "游戏", d: "文学", e: "原创",
        f: "网络", g: "其他", h: "影视", i: "诗词", j: "网易云", k: "哲学"
      };
      setCategory(catMapping[data.uuid?.substring(0, 1)] || "精选");
    } catch (e) {
      // Fallbacks on failure
      const fallbacks = [
        { text: "生如夏花之绚烂，死如秋叶之静美。", from: "泰戈尔 · 《飞鸟集》" },
        { text: "所谓无底深渊，下去，也是前程万里。", from: "木心 · 《素履之往》" },
        { text: "追风赶月莫停留，平芜尽处是春山。", from: "《增广贤文》" },
        { text: "纵有疾风起，人生不言弃。", from: "保罗·瓦勒里 · 《海滨墓园》" }
      ];
      const selected = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setQuote(selected.text);
      setAuthor(selected.from);
      setCategory("精选后备");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // Handle Copy to Clipboard
  const handleCopy = () => {
    const fullText = `"${quote}" —— ${author}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="hitokoto_widget" className="relative group glass-panel rounded-2xl p-4.5 flex flex-col justify-between h-full min-h-[150px] text-left transition-all">
      {/* Upper info menu */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-mono select-none">
        <div className="flex items-center gap-1">
          <Quote size={12} className="text-indigo-600" />
          <span className="font-semibold tracking-wider font-sans uppercase text-slate-700">一言 · {category}</span>
        </div>

        {/* Function keys */}
        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-black/5 rounded-full text-slate-600 hover:text-indigo-600 transition-colors"
            title="复制美句"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
          <button
            onClick={fetchQuote}
            className={`p-1 hover:bg-black/5 rounded-full text-slate-600 hover:text-indigo-600 transition-colors ${isLoading ? "animate-spin" : ""}`}
            title="换一句"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* Actual Quote Body */}
      <div className="flex-1 flex flex-col justify-center my-3 min-h-[50px]">
        <p className={`text-sm sm:text-base text-slate-800 font-sans leading-relaxed transition-all tracking-wide duration-300 ${isLoading ? "opacity-30 blur-xs" : "opacity-100"}`}>
          {quote}
        </p>
      </div>

      {/* Author and work sourcing */}
      <div className={`text-right text-xs text-slate-600 font-mono tracking-wide transition-all duration-300 ${isLoading ? "opacity-30 blur-xs" : "opacity-100"}`}>
        <span>—— {author}</span>
      </div>
    </div>
  );
}
