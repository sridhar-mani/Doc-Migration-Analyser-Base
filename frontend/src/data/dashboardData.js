export const sectionGroups = [
  {
    title: 'Ready for migration',
    description: 'Files with a clear structure and good readability.',
    count: 1,
    tone: 'emerald',
    files: [
      {
        name: 'Migration Playbook.pdf',
        type: 'PDF',
        pages: 18,
        words: 4820,
        paragraphs: 112,
        headings: 14,
        avgWordsPerParagraph: 43,
        status: 'Ready',
        note: 'Clean headings and consistent sections.',
      },
    ],
  },
  {
    title: 'Needs review',
    description: 'Files that need cleanup before moving into the platform.',
    count: 1,
    tone: 'amber',
    files: [
      {
        name: 'Support Guide.docx',
        type: 'DOCX',
        pages: 9,
        words: 2140,
        paragraphs: 51,
        headings: 8,
        avgWordsPerParagraph: 42,
        status: 'Review',
        note: 'Some sections need shorter paragraphs and clearer headings.',
      },
    ],
  },
]

export const analysisResults = [
  { label: 'Readability', value: 'Medium', tone: 'amber' },
  { label: 'Content clarity', value: 'Good', tone: 'emerald' },
  { label: 'Structure', value: 'Organized', tone: 'emerald' },
  { label: 'Migration readiness', value: 'Needs minor cleanup', tone: 'sky' },
]

export const outputSnapshot = {
  readiness: 'Needs minor cleanup',
  nextStep: 'Shorten long paragraphs and add clearer headings.',
}

export const insightItems = [
  'Shorten long paragraphs to improve readability before migration.',
  'Add clear section headings so the structure is easier to reuse.',
  'Check repetitive content and remove anything that does not add value.',
]

export const summaryCards = [
  { label: 'Documents', value: 2 },
  { label: 'Ready', value: 1 },
  { label: 'Needs review', value: 1 },
  { label: 'Readability', value: 'Medium' },
]
