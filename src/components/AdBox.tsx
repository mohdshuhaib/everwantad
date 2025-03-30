import React from 'react';
import { AdBoxProps } from '@/types/global';

const AdBox: React.FC<AdBoxProps> = ({ isPurchased, onClick, className = '', isLoading = false }) => {
  return (
    <div
      className={`flex items-center justify-center w-full h-full border-2 rounded-lg cursor-pointer ${
        isPurchased
          ? 'border-green-500 bg-green-50'
          : isLoading
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-gray-300 bg-gray-100'
      } ${className}`}
      onClick={onClick}
    >
      {isPurchased ? (
        <span className="text-2xl">✅</span>
      ) : isLoading ? (
        <span className="text-2xl animate-spin">⏳</span>
      ) : (
        <span className="text-2xl">💲</span>
      )}
    </div>
  );
};

export default AdBox;