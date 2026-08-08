'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { settingsService } from '@/services/settingsService';
import { Theme, AccentColor } from '@/types';
import { useTheme } from 'next-themes';
import { Sun, Moon, Palette } from 'lucide-react';

const accentColors = [
  { name: 'Amber', value: AccentColor.AMBER, color: 'bg-amber-500' },
  { name: 'Blue', value: AccentColor.BLUE, color: 'bg-blue-500' },
  { name: 'Pink', value: AccentColor.PINK, color: 'bg-pink-500' },
  { name: 'Rose', value: AccentColor.ROSE, color: 'bg-rose-500' },
  { name: 'Emerald', value: AccentColor.EMERALD, color: 'bg-emerald-500' },
  { name: 'Black', value: AccentColor.BLACK, color: 'bg-gray-900' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState<AccentColor>(
    user?.accentColor || AccentColor.BLUE
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAccentColor(user.accentColor);
      setTheme(user.theme);
    }
  }, [user, setTheme]);

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      setLoading(true);
      await settingsService.updateSettings({ theme: newTheme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccentColorChange = async (newColor: AccentColor) => {
    setAccentColor(newColor);
    try {
      setLoading(true);
      await settingsService.updateSettings({ accentColor: newColor });
      // Update document class for accent color
      document.documentElement.classList.remove(
        'accent-amber',
        'accent-blue',
        'accent-pink',
        'accent-rose',
        'accent-emerald',
        'accent-black'
      );
      document.documentElement.classList.add(`accent-${newColor.toLowerCase()}`);
    } catch (error) {
      console.error('Failed to update accent color:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply accent color class on mount
    if (user) {
      document.documentElement.classList.add(`accent-${user.accentColor.toLowerCase()}`);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <AppLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sun className="h-5 w-5 mr-2" />
            Theme
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange(Theme.LIGHT)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === Theme.LIGHT
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sun className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Light</span>
                </div>
              </button>
              <button
                onClick={() => handleThemeChange(Theme.DARK)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === Theme.DARK
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Moon className="h-5 w-5" />
                  <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Accent Color Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Accent Color
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentColorChange(color.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accentColor === color.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                title={color.name}
              >
                <div className={`w-8 h-8 rounded-full ${color.color} mx-auto mb-2`} />
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Settings Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Settings
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Theme</span>
              <span className="text-gray-900 dark:text-white capitalize">{theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Accent Color</span>
              <span className="text-gray-900 dark:text-white capitalize">{accentColor}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
