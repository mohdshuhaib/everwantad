import React, { useState, useEffect } from 'react';
import { AdModalProps, AdFormData } from '@/types/global';

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [image, setImage] = useState<File | null>(null);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setImage(null); // Reset image (since it's a File object, we can't set it directly)
      setHeading(initialData.heading || '');
      setDescription(initialData.description || '');
    } else {
      setImage(null);
      setHeading('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      image,
      heading,
      description,
      ...(initialData?.id && { id: initialData.id }),
      ...(initialData?.image_url && { image_url: initialData.image_url }),
      ...(initialData?.box_index && { box_index: initialData.box_index })
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Advertisement' : 'Add Advertisement'}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              accept="image/*"
            />
            {initialData?.image_url && !image && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current Image:</p>
                <img
                  src={initialData.image_url}
                  alt="Current ad"
                  className="mt-1 h-20 object-contain"
                />
              </div>
            )}
          </div>

          {/* Heading Input */}
          <div className="mb-4">
            <label htmlFor="heading" className="block text-sm font-medium text-gray-700">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={3}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdModal;