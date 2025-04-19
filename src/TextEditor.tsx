import React from "react";
import useEditor from "./state/use-editor";

interface TextEditorProps {}

const TextEditor: React.FC<TextEditorProps> = () => {
  const { currentEditedItem } = useEditor();

  if (currentEditedItem?.type !== "text") {
    return null;
  }

  return (
    <div>
      <div>Editor</div>
      <div>
        <input
          type="text"
          placeholder="Edit Content"
          value={currentEditedItem.text}
          defaultValue={currentEditedItem.text}
        />
      </div>
    </div>
  );
};

export default TextEditor;
