import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import CommandCard from './CommandCard';

export default function GroupTree({
  group,
  commands,
  subgroups,
  onAddCommand,
  onEditCommand,
  onDeleteCommand,
  onAddSubgroup,
  onEditGroup,
  onDeleteGroup,
  onMoveCommand,
  level = 0
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const [isDragOver, setIsDragOver] = useState(false);

  const groupCommands = commands.filter((cmd) => cmd.group_id === group.id);
  const childGroups = subgroups.filter((g) => g.parent_id === group.id);

  const handleEditGroup = () => {
    if (isEditing && groupName.trim()) {
      onEditGroup(group.id, groupName);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEditGroup();
    } else if (e.key === 'Escape') {
      setGroupName(group.name);
      setIsEditing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const commandId = e.dataTransfer.getData('text/plain');
    if (commandId) {
      onMoveCommand(commandId, group.id);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      <div
        className={`bg-gray-800 border rounded-lg mb-3 overflow-hidden transition-all ${
          isDragOver
            ? 'border-purple-500 border-2 bg-gray-700'
            : 'border-gray-700'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-800 to-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-600 rounded transition cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-300" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-300" />
            )}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onBlur={handleEditGroup}
              onKeyDown={handleKeyPress}
              className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 text-white rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              autoFocus
            />
          ) : (
            <h2 className="flex-1 text-lg font-bold text-white">
              {group.name}
            </h2>
          )}

          <div className="flex gap-1">
            <button
              onClick={() => onAddCommand(group.id)}
              className="p-2 text-purple-400 hover:bg-gray-600 rounded transition cursor-pointer"
              title="Add Command"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddSubgroup(group.id)}
              className="p-2 text-blue-400 hover:bg-gray-600 rounded transition cursor-pointer"
              title="Add Subgroup"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleEditGroup}
              className="p-2 text-gray-400 hover:bg-gray-600 rounded transition cursor-pointer"
              title="Edit Group"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="p-2 text-red-400 hover:bg-gray-600 rounded transition cursor-pointer"
              title="Delete Group"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="overflow-hidden">
            <div className="p-4 space-y-3">
              {groupCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onEdit={onEditCommand}
                  onDelete={onDeleteCommand}
                />
              ))}

              {childGroups.map((childGroup) => (
                <GroupTree
                  key={childGroup.id}
                  group={childGroup}
                  commands={commands}
                  subgroups={subgroups}
                  onAddCommand={onAddCommand}
                  onEditCommand={onEditCommand}
                  onDeleteCommand={onDeleteCommand}
                  onAddSubgroup={onAddSubgroup}
                  onEditGroup={onEditGroup}
                  onDeleteGroup={onDeleteGroup}
                  onMoveCommand={onMoveCommand}
                  level={level + 1}
                />
              ))}

              {groupCommands.length === 0 && childGroups.length === 0 && (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No commands or subgroups yet. Click + to add.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
