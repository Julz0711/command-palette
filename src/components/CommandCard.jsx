import { useState } from 'react';
import { Copy, Edit2, Trash2, Check, GripVertical } from 'lucide-react';

export default function CommandCard({ command, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [copiedSegment, setCopiedSegment] = useState(null);

  const handleCopy = async (text, segmentIndex = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (segmentIndex !== null) {
        setCopiedSegment(segmentIndex);
        setTimeout(() => setCopiedSegment(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Split command into segments by placeholders
  const parseCommandSegments = (text) => {
    const segments = [];
    const regex = /<[^>]+>/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before placeholder
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      // Add placeholder
      segments.push({
        type: 'placeholder',
        content: match[0]
      });
      lastIndex = regex.lastIndex;
    }
    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    return segments;
  };

  const segments = parseCommandSegments(command.command_text);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', command.id);
      }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-purple-500 transition-all cursor-move"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2 flex-1">
          <GripVertical className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <h3 className="font-semibold text-white">{command.title}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(command)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(command.id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="bg-gray-900 w-full border border-gray-700 rounded px-3 py-2 font-mono text-sm overflow-x-auto">
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {segments.map((segment, index) => (
              <span
                key={index}
                onClick={() => {
                  if (segment.content.trim()) {
                    handleCopy(segment.content, index);
                  }
                }}
                className={`command-segment inline-flex items-center ${
                  segment.type === 'placeholder'
                    ? 'placeholder-text'
                    : 'text-gray-300'
                } ${segment.content.trim() ? 'cursor-pointer px-1' : ''}`}
                title={
                  segment.content.trim()
                    ? `Click to copy: ${segment.content}`
                    : ''
                }
              >
                {segment.content}
                {copiedSegment === index && (
                  <Check className="w-3 h-3 ml-1 text-green-400 inline" />
                )}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleCopy(command.command_text)}
          className="flex flex-nowrap items-center justify-center gap-2 px-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
