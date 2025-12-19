/**
 * ShareButtons Component
 * Story 16.7c: Social sharing buttons
 *
 * Provides share buttons for Twitter/X, LinkedIn, and optionally email.
 */

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  showEmail?: boolean
}

function TwitterIcon() {
  return (
    <svg
      data-testid="twitter-icon"
      aria-hidden="true"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      data-testid="linkedin-icon"
      aria-hidden="true"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      data-testid="email-icon"
      aria-hidden="true"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function getTwitterShareUrl(url: string, title: string): string {
  const params = new URLSearchParams({
    url,
    text: title,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

function getLinkedInShareUrl(url: string): string {
  const params = new URLSearchParams({
    url,
  })
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
}

function getEmailShareUrl(url: string, title: string, description?: string): string {
  const subject = title
  const body = description
    ? `${description}\n\nRead more: ${url}`
    : `Check out this paper: ${url}`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const ShareButtons = ({ url, title, description, showEmail = false }: ShareButtonsProps) => {
  const twitterUrl = getTwitterShareUrl(url, title)
  const linkedinUrl = getLinkedInShareUrl(url)
  const emailUrl = getEmailShareUrl(url, title, description)

  const buttonBaseClass =
    'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors'

  return (
    <div
      data-testid="share-buttons"
      className="share-buttons print:hidden flex flex-wrap items-center gap-3"
    >
      <span className="text-sm font-medium text-gray-600">Share:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBaseClass} text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-black`}
        aria-label="Share on X (Twitter)"
      >
        <TwitterIcon />
        <span className="sr-only sm:not-sr-only">X</span>
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBaseClass} text-[#0A66C2] bg-blue-50 hover:bg-blue-100`}
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
        <span className="sr-only sm:not-sr-only">LinkedIn</span>
      </a>

      {showEmail && (
        <a
          href={emailUrl}
          className={`${buttonBaseClass} text-gray-700 bg-gray-100 hover:bg-gray-200`}
          aria-label="Share via email"
        >
          <EmailIcon />
          <span className="sr-only sm:not-sr-only">Email</span>
        </a>
      )}
    </div>
  )
}

export default ShareButtons
