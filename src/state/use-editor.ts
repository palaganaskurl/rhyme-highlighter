import { create } from "zustand";
import { Item, WordsWithTimestamps } from "../types";
import { filteredWordDataRaw } from "../data";
import { FPS } from "../constants";

interface EditorState {
  currentEditedItem: Item | null;
  setCurrentEditedItem: (item: Item | null) => void;

  wordsWithTimestamps: WordsWithTimestamps[];
  setWordsWithTimestamps: (words: WordsWithTimestamps[]) => void;

  wordToHighlightMap: Record<string, string>;
  setWordToHighlightMap: (map: Record<string, string>) => void;
}

const useEditor = create<EditorState>((set) => ({
  currentEditedItem: null,
  setCurrentEditedItem: (item) => set(() => ({ currentEditedItem: item })),

  // TODO: Replace this with the user input
  wordsWithTimestamps: filteredWordDataRaw
    .map((word) => {
      return {
        word: word.value,
        timestamp: word.ts * FPS, // Assuming each word is 30 frames long
        durationInFrames: (word.end_ts - word.ts) * FPS,
      };
    })
    .slice(0, 500),
  setWordsWithTimestamps: (words) =>
    set(() => ({ wordsWithTimestamps: words })),

  wordToHighlightMap: {},
  setWordToHighlightMap: (map) => set(() => ({ wordToHighlightMap: map })),
}));

export default useEditor;
