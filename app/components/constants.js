export const contentTypeMapping = {
    'blog': 'Blog Post',
    'workshop': 'Hands-on Workshop',
    'jumpstart': 'SageMaker JumpStart',
    'solution': 'AWS Solution',
    'video': 'Video'
  }

export const useCaseMapping = {
    'text-generation': 'Text Generation',
    'summarization-paraphrasing': 'Summarization & Paraphrasing',
    'search': 'Search',
    'chat': 'Chat',
    'code-generation': 'Code Generation',
    'question-answering': 'Question Answering',
    'sentiment-analysis': 'Sentiment Analysis',
    'image-generation': 'Image Generation',
    'image-to-text': 'Image-to-Text',
    'personalization': 'Personalization',
    'fine-tuning': 'Model Fine Tuning',
    'classification-NER': 'Named Entity Recognition & Classification',
    'best-practices': 'Generative AI Best Practices',
    'vector-database': 'Vector Database',
    'RAG': 'Retrieval Augmented Generation'
  }

export const useCasesOptions = [
    // this should better be dynamic
    { label: 'text-generation', value: '1' },
    { label: 'summarization-paraphrasing', value: '2' },
    { label: 'search', value: '3' },
    { label: 'chat', value: '4' },
    { label: 'code-generation', value: '5' },
    { label: 'question-answering', value: '6' },
    { label: 'sentiment-analysis', value: '7' },
    { label: 'image-generation', value: '8' },
    { label: 'image-to-text', value: '9' },
    { label: 'personalization', value: '10' },
    { label: 'fine-tuning', value: '11' },
    { label: 'classification-NER', value: '12' },
    { label: 'best-practices', value: '13'},
    { label: 'vector-database', value: '14' },
    { label: 'RAG', value: '15'}
  ]

export const contentTypesOptions = [
  // this should better be dynamic
  { label: 'blog', value: '1' },
  { label: 'workshop', value: '2' },
  { label: 'jumpstart', value: '3' },
  { label: 'solution', value: '4' },
  { label: 'video', value: '5' }
]

export const SEARCHABLE_COLUMNS_CARDS = [ 'name', 'url', 'useCases', 'type', 'update', 'imageUrl' ]

export const cardsVisiblePreferencesOptions = [
  { id: "url", label: "Url" },
  { id: "useCases", label: "Use cases" },
  { id: "type", label: "Content type" },
  { id: "update", label: "Date" },
  { id: "image", label: "Image" }
]
export const cardsVisibleContent = [ "url", "useCases", "type", "update", "image" ]
