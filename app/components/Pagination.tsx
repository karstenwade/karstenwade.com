'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const isPreviousDisabled = currentPage <= 1
  const isNextDisabled = currentPage >= totalPages

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        aria-label="Previous page"
        className={`px-4 py-2 rounded-md border ${
          isPreviousDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        Previous
      </button>

      <span aria-current="page" className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="Next page"
        className={`px-4 py-2 rounded-md border ${
          isNextDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
        }`}
      >
        Next
      </button>
    </nav>
  )
}
