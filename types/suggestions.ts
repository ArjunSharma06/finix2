export interface SmartSuggestion {
  title: string;
  description: string;
  savings: number;
  category: string;
  icon?: "alert" | "bulb" | "zap";
}