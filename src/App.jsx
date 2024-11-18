import React, { useState } from "react";
import Draggable from "react-draggable";

const App = () => {
  const [texts, setTexts] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const addText = () => {
    const newTextObject = {
      id: Date.now(),
      content: "Add",
      styles: {
        fontSize: "16px",
        fontWeight: "normal",
        fontStyle: "normal",
        display: "inline-block", // Ensure the text element behaves like an inline element
      },
    };
    setHistory([...history, texts]);
    setTexts([...texts, newTextObject]);
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      setRedoHistory([...redoHistory, texts]);
      setTexts(previousState);
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory.pop();
      setHistory([...history, texts]);
      setTexts(nextState);
    }
  };

  const updateText = (id, content) => {
    setHistory([...history, texts]);
    setTexts(
      texts.map((text) => (text.id === id ? { ...text, content } : text))
    );
  };

  const updateStyles = (id, styles) => {
    setHistory([...history, texts]);
    setTexts(
      texts.map((text) => (text.id === id ? { ...text, styles } : text))
    );
  };

  const handleKeyDown = (id, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateText(id, e.target.innerText);
      e.target.blur();
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-400 to-indigo-200 flex flex-col items-center relative">
      <div className="my-4">
        <button
          onClick={addText}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add Text
        </button>
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md ml-2"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={redoHistory.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
        >
          Redo
        </button>
      </div>
      <div className="editor ">
        {texts.map((text) => (
          <Draggable key={text.id}>
            <div
              contentEditable
              suppressContentEditableWarning
              className="p-2 m-2 border border-transparent rounded-md bg-transparent cursor-move inline-block"
              style={text.styles}
              onClick={() => setSelectedId(text.id)}
              onBlur={(e) => updateText(text.id, e.target.innerText)}
              onKeyDown={(e) => handleKeyDown(text.id, e)}
            >
              {text.content}
            </div>
          </Draggable>
        ))}
      </div>
      <FontControls selectedId={selectedId} updateStyles={updateStyles} />
    </div>
  );
};

const FontControls = ({ selectedId, updateStyles }) => {
  if (selectedId === null) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex items-center justify-center space-x-4">
      <label className="mr-2">
        Font Size:
        <input
          type="number"
          className="ml-2 px-2 py-1 border border-gray-300 rounded-md"
          onChange={(e) =>
            updateStyles(selectedId, { fontSize: `${e.target.value}px` })
          }
        />
      </label>
      <label className="mr-2">
        Bold:
        <input
          type="checkbox"
          className="ml-2"
          onChange={(e) =>
            updateStyles(selectedId, {
              fontWeight: e.target.checked ? "bold" : "normal",
            })
          }
        />
      </label>
      <label>
        Italic:
        <input
          type="checkbox"
          className="ml-2"
          onChange={(e) =>
            updateStyles(selectedId, {
              fontStyle: e.target.checked ? "italic" : "normal",
            })
          }
        />
      </label>
    </div>
  );
};

export default App;
