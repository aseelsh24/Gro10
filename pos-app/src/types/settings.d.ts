export interface Settings {
  language: string;
  currency: string;
  tax_rate: number;
  company_name: string;
  receipt_footer: string;
  theme: 'light' | 'dark';
  toggleLanguage: () => void;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}