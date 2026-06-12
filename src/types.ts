export interface WeatherInfo {
  city: string;
  temp: number;
  condition: string; // e.g. "Sunny", "Cloudy", "Rainy"
  description: string;
  humidity: string;
  windSpeed: string;
  icon: string; // Weather icon identifier or emoji
}

export interface GuestbookMessage {
  id: string;
  name: string;
  role: string; // e.g. "Developer", "Designer", "Visitor"
  content: string;
  timestamp: string;
  reply?: string; // AI Replica reply
  isAiReplying?: boolean;
}

export interface PresetWallpaper {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}
