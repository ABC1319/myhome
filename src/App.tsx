/// <reference types="vite/client" />
import React, { useState, useEffect } from "react";
import { 
  Github, Mail, MessageSquare, Compass, Terminal, Radio, 
  Sparkles, Coffee, Heart, Globe, MessageCircle
} from "lucide-react";

import { getAssetUrl } from "./utils";
import Clock from "./components/Clock";
import Weather from "./components/Weather";
import Hitokoto from "./components/Hitokoto";
import NavigatorGrid from "./components/NavigatorGrid";
import Skills from "./components/Skills";
import MusicPlayer from "./components/MusicPlayer";
import AIGuestbook from "./components/AIGuestbook";
import AIChat from "./components/AIChat";
import ControlCenter from "./components/ControlCenter";

type MenuTab = "sites" | "skills" | "player" | "guestbook" | "chat";

export default function App() {
  // Sync core visual aesthetics from localStorage persistence
  const [wallpaper, setWallpaper] = useState(() => {
    const defaultRaw = "assets/帆船-沙滩-治愈系.webp";
    const saved = localStorage.getItem("homepage_wallpaper");
    if (!saved) return getAssetUrl(defaultRaw);
    
    // Fallback if the saved url is a legacy path
    if (saved.includes('/src/assets/')) return getAssetUrl(defaultRaw);
    return saved;
  });

  const [blurAmount, setBlurAmount] = useState(() => {
    const cached = localStorage.getItem("homepage_blur");
    return cached ? parseInt(cached, 10) : 18;
  });

  const [fontStyle, setFontStyle] = useState(() => {
    return localStorage.getItem("homepage_font") || "font-sans";
  });

  const [opacityAmount, setOpacityAmount] = useState(() => {
    const cached = localStorage.getItem("homepage_opacity");
    return cached ? parseFloat(cached) : 0.35;
  });

  const [visitorCount, setVisitorCount] = useState<number>(1258);
  const [activeTab, setActiveTab] = useState<MenuTab>("sites");
  
  // Custom dialogs/Popups for Bilibili, WeChat, QQ
  const [socialPopup, setSocialPopup] = useState<{ type: string; content: string; qrCode?: string } | null>(null);

  // Write visual settings transitions to localStorage
  useEffect(() => {
    localStorage.setItem("homepage_wallpaper", wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem("homepage_blur", String(blurAmount));
  }, [blurAmount]);

  useEffect(() => {
    localStorage.setItem("homepage_font", fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem("homepage_opacity", String(opacityAmount));
  }, [opacityAmount]);

  // Read server-side visitor logs on mount (with robust retry & silent fallback to avoid logging critical errors)
  useEffect(() => {
    let active = true;
    const fetchVisitorWithRetry = async (retries = 3, delay = 1500) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch("/api/visitor");
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const data = await res.json();
          if (active && data && data.success && data.visitorCount) {
            setVisitorCount(data.visitorCount);
            return;
          }
        } catch (err) {
          if (i === retries - 1) {
            console.warn("Gracefully unresolved visitor analytics fetch, using default cached count.", err);
          } else {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
    };
    fetchVisitorWithRetry();
    return () => {
      active = false;
    };
  }, []);

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={16} />,
      url: "https://github.com/",
      tip: "查看开源主页仓库"
    },
    {
      name: "电子邮箱",
      icon: <Mail size={16} />,
      url: "mailto:lulu@gmail.com",
      tip: "lulu0@gmail.com"
    },
    {
      name: "微信",
      icon: <MessageCircle size={16} className="text-emerald-600" />,
      action: () => setSocialPopup({ 
        type: "微信 (WeChat Contact)", 
        content: "微信号: developer_lulu",
        qrCode: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&q=80" // High quality generic abstract code
      }),
      tip: "扫码添加微信"
    },
    {
      name: "QQ 联系",
      icon: <span className="font-mono text-xs font-bold text-sky-600">QQ</span>,
      action: () => setSocialPopup({
        type: "腾讯 QQ (QQ Social)",
        content: "QQ号: 123456789",
      }),
      tip: "即刻进行 QQ 洽谈"
    }
  ];

  // Dynamic recognition of dark-toned backgrounds to harmonize module colors and background
  const isDarkBg = 
    wallpaper.includes("夜晚") || 
    wallpaper.includes("夜景") || 
    wallpaper.includes("二次元") || 
    wallpaper.includes("城市") || 
    wallpaper.includes("yewan") || 
    wallpaper.includes("skyline") || 
    wallpaper.includes("chengshi") || 
    wallpaper.includes("erciyuan") ||
    wallpaper.includes("diaochuang") ||
    wallpaper.includes("吊床");

  return (
    <div className={`relative w-full min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden ${fontStyle} select-none ${isDarkBg ? "dark-theme" : "light-theme"}`}>
      {/* 1. Backdrop Fixed Wallpaper */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-102"
        style={{ backgroundImage: `url("${getAssetUrl(wallpaper)}")` }}
      />

      {/* 2. Glassmorphism Blur Dynamic filter layer */}
      <div 
        className="fixed inset-0 transition-all duration-500 ease-in-out"
        style={{ 
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          backgroundColor: isDarkBg 
            ? `rgba(15, 23, 42, ${opacityAmount * 1.15})` 
            : `rgba(255, 255, 255, ${opacityAmount})`
        }}
      />

      {/* Decorative ambient subtle circle light flows */}
      <div className="ambient-glow-circle top-10 left-[15%] w-96 h-96 bg-indigo-500/20 rounded-full"></div>
      <div className="ambient-glow-circle bottom-10 right-[15%] w-96 h-96 bg-purple-500/20 rounded-full"></div>

      {/* 3. Main Workspace Grid Container (Scrollable only if screen is very short, otherwise fully fit) */}
      <main className="relative z-10 w-full min-h-[100dvh] lg:h-full flex flex-col items-center justify-between px-3 sm:px-4 py-4 sm:py-6 md:px-8 xl:px-12 overflow-y-auto custom-scrollbar">
        
        {/* Master Flex container (stacks on small, splits on large with elegant content bounds) */}
        <div className="w-full max-w-2xl lg:max-w-5xl xl:max-w-6xl my-auto grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6 xl:gap-8 items-stretch pt-2 lg:pt-4 pb-4">
          
          {/* ================= LEFT GRID COLUMN (Clock, Weather, Hitokoto) ================= */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4 lg:space-y-0.5 animate-fade-in-blur">
            {/* Clock Widget */}
            <div className="bg-transparent pl-1">
              <Clock />
            </div>

            {/* Weather + Hitokoto block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-3 lg:pt-0">
              <Weather />
              <div className="lg:mt-4">
                <Hitokoto />
              </div>
            </div>
          </div>

          {/* ================= RIGHT GRID COLUMN (Aesthetics, Tabs Menu & details) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-4 animate-scale-up">
            
            {/* Primary Profile details and Social media indicators */}
            <div 
              className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4.5 text-left border border-white/30 relative overflow-hidden"
              style={{ background: "rgba(255, 255, 255, 0.55)" }}
            >
              {/* Profile Avatar (3D rotating glows) */}
              <div className="relative group/avatar flex-shrink-0">
                <div className="absolute inset-x-0 inset-y-0 -m-1 rounded-full bg-gradient-to-tr from-indigo-500 via-pink-500 to-cyan-400 filter blur-sm group-hover/avatar:blur-md opacity-40 group-hover/avatar:opacity-100 transition-all animate-spin-slow"></div>
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-slate-200/80 bg-white shadow-xl transition-transform duration-500 group-hover/avatar:rotate-[360deg] cursor-pointer">
                  <img
                    src={getAssetUrl("avatar2.png")}
                    alt="Developer Avatar"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bio & Intro Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left space-y-1.5 z-10 w-full">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 justify-center sm:justify-start">
                  <h1 className="text-lg sm:text-xl font-display font-semibold text-slate-900 tracking-wide">
                    Sky
                  </h1>
                  <span className="text-xs text-indigo-600 font-mono">
                    @lulu
                  </span>
                </div>
                
                <h2 className="text-xs sm:text-sm text-slate-700 leading-normal font-sans font-medium tracking-wide">
                  全栈微机匠人 · 专注高效智能架构与微观设计美学
                </h2>
                
                {/* Contact Shortcuts badges list */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 flex-wrap">
                  {socialLinks.map((soc, idx) => (
                    soc.action ? (
                      <button
                        key={idx}
                        onClick={soc.action}
                        className="p-2 bg-white/40 hover:bg-white border border-slate-200 hover:border-indigo-500/20 rounded-xl text-slate-700 hover:text-indigo-600 transition-all cursor-pointer shadow-sm relative group/btn"
                        title={soc.name}
                      >
                        {soc.icon}
                        <span className="absolute bottom-full mb-1 px-2 py-1 bg-white border border-slate-200 text-[9px] text-slate-800 rounded opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-55 font-mono truncate max-w-44 whitespace-nowrap shadow-md">
                          {soc.tip}
                        </span>
                      </button>
                    ) : (
                      <a
                        key={idx}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/40 hover:bg-white border border-slate-200 hover:border-indigo-500/20 rounded-xl text-slate-700 hover:text-indigo-600 transition-all cursor-pointer shadow-sm relative group/btn"
                        title={soc.name}
                      >
                        {soc.icon}
                        <span className="absolute bottom-full mb-1 px-2 py-1 bg-white border border-slate-200 text-[9px] text-slate-800 rounded opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-55 font-mono truncate max-w-44 whitespace-nowrap shadow-md">
                          {soc.tip}
                        </span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Top right glass decorative stamp */}
              <div className="absolute right-0 top-0 text-[64px] font-display font-black text-slate-900/5 pointer-events-none tracking-tighter mix-blend-overlay">
              </div>
            </div>

            {/* Details tabs switcher system */}
            <div 
              className="glass-panel w-full rounded-2xl flex flex-col overflow-hidden h-[420px] sm:h-[460px]"
              style={{ background: "rgba(255, 255, 255, 0.45)", borderColor: "rgba(255, 255, 255, 0.25)" }}
            >
              
              {/* Tab selector buttons navigation bars */}
              <div className="grid grid-cols-5 border-b border-slate-200/50 bg-white/35 p-1">
                {[
                  { id: "sites", name: "导航", icon: <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                  { id: "skills", name: "技能", icon: <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                  { id: "player", name: "电台", icon: <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                  { id: "guestbook", name: "留言板", icon: <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                  { id: "chat", name: "AI 助手", icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as MenuTab)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-semibold cursor-pointer select-none transition-all border-r border-slate-200/10 last:border-r-0 whitespace-nowrap ${activeTab === tab.id ? "bg-white/45 text-indigo-600 shadow-inner font-bold" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic content wrapper with clean high stability */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white/10">
                {activeTab === "sites" && (
                  <div className="flex-1 p-4.5 overflow-y-auto custom-scrollbar animate-fadeIn">
                    <NavigatorGrid />
                  </div>
                )}
                {activeTab === "skills" && (
                  <div className="flex-1 p-4.5 overflow-y-auto custom-scrollbar animate-fadeIn">
                    <Skills />
                  </div>
                )}
                {activeTab === "player" && (
                  <div className="flex-1 p-4.5 overflow-y-auto custom-scrollbar animate-fadeIn">
                    <MusicPlayer />
                  </div>
                )}
                {activeTab === "guestbook" && (
                  <div className="flex-1 p-4.5 overflow-y-auto custom-scrollbar animate-fadeIn">
                    <AIGuestbook />
                  </div>
                )}
                {activeTab === "chat" && (
                  <div className="flex-1 p-4.5 flex flex-col overflow-hidden animate-fadeIn">
                    <AIChat />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 4. Elegant Website Footer (Site Stats & Licenses) */}
        <footer className="w-full text-center space-y-2 mt-4 select-none">

          <div className="text-[10px] sm:text-xs text-slate-600 font-sans tracking-wide">
            <span>© 2026  </span>
            <a href="https://myhome.13145219.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 border-b border-slate-300 hover:border-indigo-600 transition-colors">
               My home
            </a>
            <span> | By Sky</span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            萌ICP备20261990号 // ALL RIGHTS RESERVED
          </div>
        </footer>

      </main>

      {/* Floating social popup dialog (WeChat, QQ details) */}
      {socialPopup && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-55 flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-xs bg-white/95 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center space-y-4 animate-scale-up relative text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div>
              <h3 className="text-sm font-display font-semibold text-slate-900 tracking-wide">
                {socialPopup.type}
              </h3>
              <p className="text-xs text-slate-600 mt-1 pb-1 font-sans">{socialPopup.content}</p>
            </div>

            {socialPopup.qrCode && (
              <div className="w-40 h-40 bg-white p-2 rounded-xl border-4 border-indigo-600/20 overflow-hidden shadow-inner flex items-center justify-center shadow-md">
                <img 
                  src={socialPopup.qrCode} 
                  alt="QR Code" 
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <button
              onClick={() => setSocialPopup(null)}
              className="py-1.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer select-none"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 5. Custom Wallpaper/Glass/Typography customize controllers */}
      <ControlCenter
        currentWallpaper={wallpaper}
        setWallpaper={setWallpaper}
        blurAmount={blurAmount}
        setBlurAmount={setBlurAmount}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        opacityAmount={opacityAmount}
        setOpacityAmount={setOpacityAmount}
      />
    </div>
  );
}
