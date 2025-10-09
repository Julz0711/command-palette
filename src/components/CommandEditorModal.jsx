import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function CommandEditorModal({
  isOpen,
  onClose,
  onSave,
  command,
  groupId
}) {
  const [title, setTitle] = useState(command?.title || '');
  const [commandText, setCommandText] = useState(command?.command_text || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: command?.id,
      group_id: groupId,
      title,
      command_text: commandText
    });
    setTitle('');
    setCommandText('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setCommandText('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {command ? 'Edit Command' : 'New Command'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Command Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Command
                </label>
                <textarea
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition font-mono text-sm"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-400 mt-2">
                  Use{' '}
                  <span className="placeholder-text">&lt;placeholder&gt;</span>{' '}
                  syntax for variables
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
                >
                  {command ? 'Update' : 'Create'} Command
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
