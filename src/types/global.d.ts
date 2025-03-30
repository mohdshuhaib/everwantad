import { ReactNode, FormEvent } from 'react';

// Type for AdBox component
interface AdBoxProps {
  isPurchased: boolean;
  onClick: () => void;
  className?: string;
}

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdFormData) => void;
  initialData?: Partial<AdFormData>;
}

interface AdFormData {
  id?: string;
  image?: File | null;
  image_url?: string;
  heading: string;
  description: string;
  box_index?: number | null;
  user_id?: string;
}

interface Ad extends Omit<AdFormData, 'image'> {
  id: string;
  image_url: string;
  created_at: string;
}

// Type for User (if needed)
interface User {
  id: string;
  email: string;
}

interface Ad {
  id: string;
  user_id: string;
  image_url: string;
  heading: string;
  description: string;
  box_index: number;
  created_at: string;
}

// Type for Ad form data
interface AdFormData {
  image: File | null;
  image_url?: string; // Optional because it's not required when creating a new ad
  heading: string;
  description: string;
  box_index?: number; // Optional because it's not required when creating a new ad
}

// Export all types
export {
  AdBoxProps,
  AdModalProps,
  AdFormData,
  User,
  Ad,
  AdFormData,
};