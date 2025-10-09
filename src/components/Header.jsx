import { LogOut } from 'lucide-react';

export default function Header({ onLogout, userEmail }) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Command Clipboard</h1>
            {userEmail && (
              <p className="text-sm text-gray-400 mt-1">{userEmail}</p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
