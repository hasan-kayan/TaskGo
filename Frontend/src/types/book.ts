export interface Book {
  id: string;                 // UUID
  title: string;
  author: string;
  year: number;
  isbn?: string;
  description?: string;
  type?: string;              // backend uses "type" instead of "genre"
  publisher?: string;
  coverImageURL?: string;     // backend uses "cover_image_url"
  created_at?: string;        // ISO timestamp
  updated_at?: string;
  deleted_at?: string | null;
}

export interface BookFormData {
  title: string;
  author: string;
  year: number | '';
  isbn?: string;
  description?: string;
  type?: string;
  publisher?: string;
  coverImageURL?: string;
}

export interface ApiError {
  error: string;             // matches { "error": "...message..." }
  success?: false;           // optional flag
  status?: number;
}
