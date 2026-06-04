"use client";

import { create } from "zustand";
import type {
  WardrobeItem,
  Outfit,
  ShoppingSuggestion,
  StyleName,
  Occasion,
  Season,
} from "@/types";

interface AppState {
  // Wardrobe
  wardrobeItems: WardrobeItem[];
  setWardrobeItems: (items: WardrobeItem[]) => void;
  addWardrobeItem: (item: WardrobeItem) => void;
  removeWardrobeItem: (id: string) => void;

  // Style session
  selectedStyle: StyleName | null;
  selectedOccasion: Occasion | null;
  selectedSeason: Season | null;
  setSelectedStyle: (style: StyleName | null) => void;
  setSelectedOccasion: (occasion: Occasion | null) => void;
  setSelectedSeason: (season: Season | null) => void;

  // Generated outfits
  generatedOutfits: Outfit[];
  setGeneratedOutfits: (outfits: Outfit[]) => void;
  toggleFavorite: (outfitId: string) => void;

  // Shopping suggestions
  shoppingSuggestions: ShoppingSuggestion[];
  setShoppingSuggestions: (suggestions: ShoppingSuggestion[]) => void;

  // Loading states
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  wardrobeItems: [],
  setWardrobeItems: (items) => set({ wardrobeItems: items }),
  addWardrobeItem: (item) =>
    set((s) => ({ wardrobeItems: [item, ...s.wardrobeItems] })),
  removeWardrobeItem: (id) =>
    set((s) => ({
      wardrobeItems: s.wardrobeItems.filter((i) => i.id !== id),
    })),

  selectedStyle: null,
  selectedOccasion: null,
  selectedSeason: null,
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setSelectedOccasion: (occasion) => set({ selectedOccasion: occasion }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),

  generatedOutfits: [],
  setGeneratedOutfits: (outfits) => set({ generatedOutfits: outfits }),
  toggleFavorite: (outfitId) =>
    set((s) => ({
      generatedOutfits: s.generatedOutfits.map((o) =>
        o.id === outfitId ? { ...o, is_favorite: !o.is_favorite } : o
      ),
    })),

  shoppingSuggestions: [],
  setShoppingSuggestions: (suggestions) =>
    set({ shoppingSuggestions: suggestions }),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  isUploading: false,
  setIsUploading: (v) => set({ isUploading: v }),
}));
