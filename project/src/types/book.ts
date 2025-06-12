export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isbn?: string;
  description?: string;
  genre?: string;
  pages?: number;
  publisher?: string;
  coverUrl?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  year: number | '';
  isbn?: string;
  description?: string;
  genre?: string;
  pages?: number | '';
  publisher?: string;
  coverUrl?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}