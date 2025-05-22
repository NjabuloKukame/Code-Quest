import { useDarkMode } from "../components/DarkMode";
import Editor from "@monaco-editor/react";
import "../CodePlay.css";

function CodeEditor() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`monaco-container ${darkMode ? "dark" : "light"}`}>
      <Editor
        height="100%"
        language={challenge?.language?.toLowerCase() || "html"}
        theme={darkMode ? "vs-dark" : "light"}
        value={userCode}
        onChange={(value) => setUserCode(value || "")}
        options={{
          fontSize: 18,
          fontFamily: "Montserrat",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 0,
            horizontalScrollbarSize: 0,
          },
        }}
      />
    </div>
  );
}

export default CodeEditor;
