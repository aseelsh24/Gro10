import { useSettingsContext } from '../contexts/SettingsContext';

export const useSettings = () => {
  const context = useSettingsContext();
  return context;
};