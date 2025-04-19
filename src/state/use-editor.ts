import { create } from "zustand";
import { Item, WordsWithTimestamps } from "../types";

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
  wordsWithTimestamps: [],
  setWordsWithTimestamps: (words) =>
    set(() => ({ wordsWithTimestamps: words })),

  wordToHighlightMap: {},
  setWordToHighlightMap: (map) => set(() => ({ wordToHighlightMap: map })),
}));

export default useEditor;
