import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useBooks } from '../../context/BooksContext';

/* ────────────────────────────────
 * Types
 * ──────────────────────────────── */
export interface FilterOptions {
  type?: string;
  yearRange?: {
    min?: number;
    max?: number;
  };
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  totalBooks: number;
  filteredCount: number;
}

/* ────────────────────────────────
 * Component
 * ──────────────────────────────── */
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilter,
  totalBooks,
  filteredCount,
}) => {
  const { books } = useBooks();

  /* -------- unique type list from DB or fallback -------- */
  const fallbackTypes = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Business',
  ];

  const uniqueTypes = Array.from(
    new Set(
      books
        .map((b) => b.type)
        .filter((t): t is string => Boolean(t && t.trim()))
    )
  );
  const typeOptions = uniqueTypes.length ? uniqueTypes : fallbackTypes;

  /* -------- component state -------- */
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  /* -------- handlers -------- */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearch(q);
  };

  const updateFilters = (patch: Partial<FilterOptions>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFilter(next);
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilters({});
    onSearch('');
    onFilter({});
  };

  const hasActiveFilters =
    !!searchQuery ||
    !!filters.type ||
    !!filters.yearRange?.min ||
    !!filters.yearRange?.max;

  /* -------- render -------- */
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Toggle filter panel */}
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Filter size={18} className="mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="p-2 text-gray-600 hover:text-red-600"
            title="Clear all filters"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type / Genre */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) =>
                  updateFilters({ type: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Year min */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">From Year</label>
              <input
                type="number"
                value={filters.yearRange?.min ?? ''}
                onChange={(e) =>
                  updateFilters({
                    yearRange: {
                      ...filters.yearRange,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2000"
              />
            </div>

            {/* Year max */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">To Year</label>
              <input
                type="number"
                value={filters.yearRange?.max ?? ''}
                onChange={(e) =>
                  updateFilters({
                    yearRange: {
                      ...filters.yearRange,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2024"
              />
            </div>
          </div>
        </div>
      )}

      {/* Counter */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <span>
          {filteredCount === totalBooks
            ? `Showing all ${totalBooks} books`
            : `Showing ${filteredCount} of ${totalBooks} books`}
        </span>
        {hasActiveFilters && <span className="text-blue-600">Filters active</span>}
      </div>
    </div>
  );
};

export default SearchAndFilter;
