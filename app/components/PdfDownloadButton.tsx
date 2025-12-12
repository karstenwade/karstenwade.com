'use client'

import { useState, useCallback } from 'react'

interface PdfDownloadButtonProps {
  paperTitle: string
  contentSelector: string
  className?: string
}

export default function PdfDownloadButton({
  paperTitle,
  contentSelector,
  className = '',
}: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePdf = useCallback(async () => {
    setIsGenerating(true)

    try {
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      // Find the content element
      const element = document.querySelector(contentSelector) as HTMLElement | null
      if (!element) {
        console.error('Content element not found:', contentSelector)
        return
      }

      // Generate filename from title
      const filename = paperTitle
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 50)

      // PDF options for clean output
      const options = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }

      await html2pdf().set(options).from(element).save()
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [paperTitle, contentSelector])

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={isGenerating ? 'Generating PDF...' : 'Download PDF'}
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating...
        </span>
      ) : (
        'Download PDF'
      )}
    </button>
  )
}
