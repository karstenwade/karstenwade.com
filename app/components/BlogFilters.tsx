'use client'

interface BlogFiltersProps {
  categories: string[]
  tags: string[]
  selectedCategory: string | null
  selectedTags: string[]
  onCategoryChange: (category: string | null) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export default function BlogFilters({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagChange,
  onClearFilters,
}: BlogFiltersProps) {
  const activeFilterCount =
    (selectedCategory ? 1 : 0) + selectedTags.length

  const hasActiveFilters = activeFilterCount > 0

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onCategoryChange(value === '' ? null : value)
  }

  return (
    <fieldset
      role="group"
      aria-label="Filter posts"
      className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <div className="flex flex-wrap gap-6 items-start">
        {/* Category Filter */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="category-filter"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filters */}
        {tags.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedTags.includes(tag)}
                    onChange={() => onTagChange(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active filter info and clear button */}
      <div className="flex items-center justify-between mt-4">
        {activeFilterCount > 0 && (
          <span className="text-sm text-gray-600">
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
          </span>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </fieldset>
  )
}
