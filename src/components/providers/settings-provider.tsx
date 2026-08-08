"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { getTranslation } from "@/lib/i18n";

export interface SettingsData {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  logo?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxName: string;
  language: string;
  invoicePrefix: string;
  invoiceFooter?: string;
  lowStockAlert: boolean;
  theme: "light" | "dark" | "system";
}

const defaultSettings: SettingsData = {
  storeName: "RetailPOS Algérie",
  storeAddress: "12 Rue Didouche Mourad, Alger Centre",
  storePhone: "+213 21 63 00 00",
  storeEmail: "contact@retailpos.dz",
  logo: "",
  currency: "DZD",
  currencySymbol: "DA",
  taxRate: 19,
  taxName: "TVA",
  language: "fr",
  invoicePrefix: "FAC",
  invoiceFooter: "Merci pour votre confiance ! À bientôt.",
  lowStockAlert: true,
  theme: "system",
};

interface SettingsContextValue {
  settings: SettingsData;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => { },
  t: (key: string) => key,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();

  const applySettingsEffects = useCallback((newSettings: SettingsData) => {
    // 1. Sync Theme / Appearance
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }

    // 2. Sync Language & RTL / LTR layout
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const lang = newSettings.language || "fr";
      root.setAttribute("lang", lang);
      if (lang === "ar") {
        root.setAttribute("dir", "rtl");
      } else {
        root.setAttribute("dir", "ltr");
      }
    }
  }, [setTheme]);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
        applySettingsEffects(json.data);
      }
    } catch (err) {
      console.error("[SettingsProvider] Failed to fetch settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [applySettingsEffects]);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const t = useCallback((key: string) => {
    return getTranslation(settings.language, key);
  }, [settings.language]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
