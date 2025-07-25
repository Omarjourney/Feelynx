import React from 'react';

interface TipModalProps {
  open: boolean;
  onClose: () => void;
}

const packs = [5, 10, 20, 50];

const TipModal: React.FC<TipModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-4 rounded-lg w-72 text-center">
        <h2 className="text-lg mb-2">Send Tip</h2>
        <div className="space-y-2">
          {packs.map((p) => (
            <button
              key={p}
              className="w-full bg-pink-500 py-1 rounded text-white hover:bg-pink-600"
            >
              {p} Coins
            </button>
          ))}
        </div>
        <button
          className="mt-4 text-sm text-gray-400 hover:text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TipModal;
