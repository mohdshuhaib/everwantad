import React from 'react';

const AdPlaceholder: React.FC = () => {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex items-center">
            {/* Placeholder Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            {/* Placeholder Text */}
            <div className="ml-4">
              <div className="h-6 bg-gray-200 w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 w-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPlaceholder;