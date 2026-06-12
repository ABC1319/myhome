/**
 * Centralized data and constants for the application.
 */

export const PRESET_WALLPAPERS = [
  {
    id: "shanchuan",
    name: "治愈帆船",
    url: "healing-sailing.webp",
    thumbnail: "healing-sailing.webp",
    isDark: false
  },
  {
    id: "shujia",
    name: "书香角落",
    url: "bookshelf.webp",
    thumbnail: "bookshelf.webp",
    isDark: false
  },
  {
    id: "xiaowu",
    name: "乡野小屋",
    url: "countryside.webp",
    thumbnail: "countryside.webp",
    isDark: false
  },
  {
    id: "yewan",
    name: "云岚夜色",
    url: "night-sky.webp",
    thumbnail: "night-sky.webp",
    isDark: true
  },
  {
    id: "chengshi",
    name: "华灯盛世",
    url: "china-city.webp",
    thumbnail: "china-city.webp",
    isDark: true
  },
  {
    id: "erciyuan",
    name: "动漫场景",
    url: "anime-scenery.webp",
    thumbnail: "anime-scenery.webp",
    isDark: true
  },
  {
    id: "diaochuang",
    name: "静谧吊床",
    url: "hammock.webp",
    thumbnail: "hammock.webp",
    isDark: true
  },
  {
    id: "skyline",
    name: "璨烂天际",
    url: "city-skyline.webp",
    thumbnail: "city-skyline.webp",
    isDark: true
  }
];

export const VALID_WALLPAPER_FILENAMES = PRESET_WALLPAPERS.map(wp => wp.url);

export const DEFAULT_WALLPAPER = "healing-sailing.webp";

export const SITE_LOGO = "avatar2.png";
