import { useCallback, useState } from "react";
import TagView from "./components/TagView";
import { initialTree } from "./data/sampletree";


let nextId = 6;// in sampletree we have till 5 items so we fixed next will be 6

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [tree, setTree] = useState(clone(initialTree));
  const [collapsed, setCollapsed] = useState(new Set());
  const [editingNameId, setEditingNameId] = useState(null);
  const [exportedJson, setExportedJson] = useState("");

  const updateNodeById = useCallback((id, updater) => {
    setTree((prev) => {
      const t = clone(prev);
      const stack = [t];
      let found = false;
      while (stack.length) {
        const node = stack.shift();
        if (node.id === id) {
          updater(node);
          found = true;
          break;
        }
        if (node.children) node.children.forEach((c) => stack.push(c));
      }
      if (!found) console.warn("id not found", id);
      return t;
    });
  }, []);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const onAddChild = (id) => {
    updateNodeById(id, (node) => {
      if (node.data) {
        delete node.data;
        node.children = [];
      }
      if (!node.children) node.children = [];
      node.children.push({ id: nextId++, name: "New Child", data: "Data" });
    });
  };

  const onDataChange = (id, value) => {
    updateNodeById(id, (node) => {
      node.data = value;
    });
  };

  const onNameChange = (id, value) => {
    updateNodeById(id, (node) => {
      node.name = value;
    });
  };

  const exportJson = () => {
    function strip(node) {
      const out = { name: node.name };
      if (node.data !== undefined) out.data = node.data;
      if (node.children) out.children = node.children.map(strip);
      return out;
    }
    const result = strip(tree);
    const formatted = JSON.stringify(result, null, 2);
    setExportedJson(formatted);
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };
  const clearJson = () => {
    setExportedJson("");
  };

  return (
    <div className="app-root">
      <div className="canvas">
        <TagView
          node={tree}
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          onAddChild={onAddChild}
          onDataChange={onDataChange}
          onNameChange={onNameChange}
          editingNameId={editingNameId}
          setEditingNameId={setEditingNameId}
        />
        <div style={{ marginTop: 16, display: "flex", gap: "20px" }}>
          <button className="btn export-btn" onClick={exportJson}>
            Export
          </button>
          <button className="btn clear-btn" onClick={clearJson}>
            Clear
          </button>
        </div>
        {exportedJson && (
          <pre
            style={{
              background: "#f9f9f9",
              marginTop: "12px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {exportedJson}
          </pre>
        )}
      </div>
    </div>
  );
}
