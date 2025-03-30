'use client';

import React from 'react';
import { MdErrorOutline, MdCheckCircle } from 'react-icons/md';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  variant?: 'error' | 'success';
}

function ErrorModal({
  isOpen,
  onClose,
  title = 'Error',
  message = 'Something went wrong',
  variant = 'error',
}: ErrorModalProps) {
  if (!isOpen) return null;

  const iconClasses = {
    error: 'text-red-500 text-4xl',
    success: 'text-green-500 text-4xl',
  };

  const buttonClasses = {
    error: 'bg-indigo-600 hover:bg-indigo-700',
    success: 'bg-green-600 hover:bg-green-700',
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-slate-300/20 backdrop-blur-sm"
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] max-w-xs flex-col gap-4 overflow-hidden rounded-lg bg-white p-6 text-center text-slate-500 shadow-xl shadow-slate-700/10"
        id="modal"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex flex-col items-center gap-2">
          {variant === 'error' ? (
            <MdErrorOutline className={iconClasses.error} />
          ) : (
            <MdCheckCircle className={iconClasses.success} />
          )}
          <h3 className="text-xl font-medium text-slate-700" id="modal-title">
            {title}
          </h3>
        </header>
        <div className="flex-1 overflow-auto">
          <p>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`mt-2 px-4 py-2 text-white rounded-lg transition-colors ${buttonClasses[variant]}`}
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;