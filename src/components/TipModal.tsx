import React, { useState, useEffect } from 'react';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tipAmount: number) => void;
}

const suggested = [5, 10, 20, 50];

const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      const t = setTimeout(() => {
        setShowConfirm(false);
        onClose();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [showConfirm, onClose]);

  if (!isOpen) return null;

  const sendTip = (value: number) => {
    onSubmit(value);
    setShowConfirm(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-4 rounded-lg w-72 text-center">
        {showConfirm ? (
          <div className="text-lg text-green-400 animate-pulse">Thank you!</div>
        ) : (
          <>
            <h2 className="text-lg mb-2">Send Tip</h2>
            <div className="space-y-2">
              {suggested.map((p) => (
                <button
                  key={p}
                  className="w-full bg-pink-500 py-1 rounded text-white hover:bg-pink-600"
                  onClick={() => sendTip(p)}
                >
                  {p} Coins
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 bg-gray-800 p-1 text-sm"
                placeholder="Custom"
              />
              <button
                className="bg-pink-500 px-3 py-1 rounded text-white"
                onClick={() => typeof amount === 'number' && sendTip(amount)}
              >
                Send
              </button>
            </div>
            <button
              className="mt-4 text-sm text-gray-400 hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TipModal;
