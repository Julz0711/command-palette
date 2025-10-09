import { useState } from 'react';
import { X } from 'lucide-react';

export default function GroupModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialValue = ''
}) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  const handleClose = () => {
    setName(initialValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
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
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
            >
              Save
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
  );
}
