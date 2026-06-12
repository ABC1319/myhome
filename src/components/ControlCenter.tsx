import React, { useState } from "react";
import { Settings, X, Image, Sliders, Type, RotateCcw } from "lucide-react";
import { PRESET_WALLPAPERS, DEFAULT_WALLPAPER } from "../data";
import { getAssetUrl } from "../utils";

interface ControlCenterProps {
  currentWallpaper: string;
  setWallpaper: (url: string) => void;
  blurAmount: number;
  setBlurAmount: (amount: number) => void;
  fontStyle: string;
  setFontStyle: (font: string) => void;
  opacityAmount: number;
  setOpacityAmount: (opacity: number) => void;
}

export default function ControlCenter({
  currentWallpaper,
  setWallpaper,
  blurAmount,
  setBlurAmount,
  fontStyle,
  setFontStyle,
  opacityAmount,
  setOpacityAmount,
}: ControlCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const handleCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setWallpaper(customUrl.trim());
      setCustomUrl("");
    }
  };

  const handleReset = () => {
    if (confirm("确定要恢复网页的初始外观与视觉配置吗？")) {
      setWallpaper(DEFAULT_WALLPAPER); // Reset to default
      setBlurAmount(18);
      setFontStyle("font-sans");
      setOpacityAmount(0.35);
      localStorage.clear(); // Clear local items like custom weather cities
    }
  };

  const fontOptions = [
    { value: "font-sans", name: "标准 Inter" },
    { value: "font-display", name: "技术 Space Grotesk" },
    { value: "font-mono", name: "极客 JetBrains Code" }
  ];

  return (
    <>
      {/* Floating control button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-2.5 bg-white/95 hover:bg-indigo-650 border border-slate-200/80 hover:border-indigo-400 rounded-full text-slate-700 hover:text-indigo-600 shadow-xl active:scale-90 transition-all z-40 animate-pulse hover:animate-none cursor-pointer"
        title="个性壁纸与视觉控制"
      >
        <Settings size={18} />
      </button>

      {/* Slide drawer settings panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex justify-end animate-fadeIn select-none">
          {/* Backdrop X tap to close */}
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>

          {/* Core Panel Card */}
          <div className="w-full max-w-sm bg-white/95 border-l border-slate-200/80 p-5 flex flex-col justify-between h-full shadow-2xl relative animate-slide-up sm:animate-none">
            {/* Top Close bar */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/50">
                <div className="flex items-center gap-2 text-sm text-slate-900 font-sans font-semibold">
                  <Sliders size={16} className="text-indigo-600" />
                  <span>个性壁纸与视觉设置</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-black/5 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Setting details stream */}
              <div className="space-y-6 py-5 overflow-y-auto max-h-[80vh] custom-scrollbar pr-1">
                
                {/* 1. Wallpaper preset grids */}
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono">
                    <Image size={12} />
                    <span>选择预设高画质壁纸 (WALLPAPER)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_WALLPAPERS.map((wp) => (
                      <button
                        key={wp.id}
                        onClick={() => setWallpaper(wp.url)}
                        className={`group relative h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${currentWallpaper === wp.url ? "border-indigo-500 scale-95 shadow-lg shadow-indigo-500/10" : "border-transparent opacity-70 hover:opacity-100"}`}
                        title={wp.name}
                      >
                        <img
                          src={getAssetUrl(wp.thumbnail)}
                          alt={wp.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/50 text-[9px] text-white text-center truncate">
                          {wp.name}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom wallpaper input URL */}
                  <form onSubmit={handleCustomWallpaper} className="flex gap-2 pt-1.5">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="自定壁纸 URL (https://...)"
                      className="flex-1 text-[11px] px-3 py-2 rounded-lg glass-input text-slate-800 placeholder-slate-400 font-sans"
                    />
                    <button
                      type="submit"
                      className="px-2.5 bg-indigo-600 hover:bg-indigo-550 rounded-lg text-[11px] text-white font-semibold transition-colors cursor-pointer"
                    >
                      应用
                    </button>
                  </form>
                </div>

                {/* 2. Glassmorphism sliders */}
                <div className="space-y-4 text-left border-t border-slate-200/50 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono">
                    <Sliders size={12} />
                    <span>面板磨砂细节调整 (AESTHETIC CONTROLS)</span>
                  </div>

                  {/* Blur Amount Range */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>背景磨砂模糊度 (Glass Blur)</span>
                      <span className="font-mono text-indigo-600">{blurAmount}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Opacity/Transparency range */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>磨砂面板透明度 (Glass Opacity)</span>
                      <span className="font-mono text-indigo-600">{Math.round(opacityAmount * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="0.85"
                      step="0.05"
                      value={opacityAmount}
                      onChange={(e) => setOpacityAmount(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Typography selectors */}
                <div className="space-y-2.5 text-left border-t border-slate-200/50 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-605 font-mono">
                    <Type size={12} />
                    <span>选择全局阅读字体 (TYPOGRAPHY)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {fontOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFontStyle(opt.value)}
                        className={`w-full py-2 px-3 text-left rounded-lg text-xs font-sans flex items-center justify-between transition-colors border cursor-pointer ${fontStyle === opt.value ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold" : "bg-white hover:bg-slate-50 border-slate-200/60 text-slate-700"}`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          {opt.value.replace("font-", "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Reset Actions */}
            <div className="border-t border-slate-200/50 pt-4">
              <button
                onClick={handleReset}
                className="w-full py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-xs text-red-600 hover:text-red-700 font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer select-none"
              >
                <RotateCcw size={12} />
                <span>恢复视觉出厂设置</span>
              </button>
              <div className="text-[10px] text-slate-400 font-mono text-center mt-3">
                雅致个人主页 Control Core v2.1.2
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
