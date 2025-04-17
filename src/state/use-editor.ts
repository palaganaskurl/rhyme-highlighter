import { create } from "zustand";
import { Item } from "../types";

interface EditorState {
  currentEditedItem: Item | null;
  setCurrentEditedItem: (item: Item | null) => void;
}

const useEditor = create<EditorState>((set) => ({
  currentEditedItem: null,
  setCurrentEditedItem: (item) => set(() => ({ currentEditedItem: item })),
}));

export default useEditor;
