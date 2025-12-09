// components/Modal.tsx
import React from 'react';

interface ModalProps {
  title: string;
  message: string;
  actionLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const Popbutton: React.FC<ModalProps> = ({
  title,
  message,
  actionLabel,
  onConfirm,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-[#023e8a] to-[#00b4d8] text-white p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-sm mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-white text-[#023e8a] hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-white text-[#00b4d8] hover:bg-gray-200 transition font-semibold"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
