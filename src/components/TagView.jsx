import React from "react";

export default function TagView({
  node,
  collapsed,
  toggleCollapse,
  onAddChild,
  onDataChange,
  onNameChange,
  editingNameId,
  setEditingNameId,
}) {
  const isCollapsed = collapsed.has(node.id);

  const handleNameClick = (e) => {
    e.stopPropagation();
    setEditingNameId(node.id);
  };

  const handleNameKey = (e) => {
    if (e.key === "Enter") {
      onNameChange(node.id, e.target.value);
      setEditingNameId(null);
    }
  };
  return (
    <div className="tag-wrapper">
      <div className="tag-header">
        <button
          className="collapse-btn"
          onClick={() => toggleCollapse(node.id)}
        >
          {isCollapsed ? ">" : "v"}
        </button>
        <div className="tag-name" onClick={handleNameClick}>
          {editingNameId === node.id ? (
            <input
              defaultValue={node.name}
              onKeyDown={handleNameKey}
              className="name-input"
              autoFocus
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>
        <div className="spacer" />
        <button className="add-child" onClick={() => onAddChild(node.id)}>
          Add Child
        </button>
      </div>

      {!isCollapsed && (
        <div className="tag-body">
          {node.data !== undefined && (
            <div className="data-row">
              <label className="data-label">Data</label>
              <input
                value={node.data}
                onChange={(e) => onDataChange(node.id, e.target.value)}
                className="data-input"
              />
            </div>
          )}

          {node.children &&
            node.children.map((child) => (
              <TagView
                key={child.id}
                node={child}
                collapsed={collapsed}
                toggleCollapse={toggleCollapse}
                onAddChild={onAddChild}
                onDataChange={onDataChange}
                onNameChange={onNameChange}
                editingNameId={editingNameId}
                setEditingNameId={setEditingNameId}
              />
            ))}
        </div>
      )}
    </div>
  );
}