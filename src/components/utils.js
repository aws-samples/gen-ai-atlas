import { useEffect, useState } from "react";
import { getImageSize } from 'react-image-size';

export const useCheckMobileScreen = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  return (width <= 768);
}

const contentTypeMapping = {
  'blog': 'Blog Post',
  'workshop': 'Hands-on Workshop',
  'jumpstart': 'SageMaker JumpStart',
  'solution': 'AWS Solution',
  'video': 'Video'
}

export const mapContentTypeName = (typeName) => {
  const mapped = contentTypeMapping[typeName]
  if(!mapped){
    console.error('ERROR: missing mapping for content type label:', typeName)
  }
  return mapped
}

const useCaseMapping = {
  'text-generation': 'Text Generation',
  'summarization-paraphrasing': 'Summarization & Paraphrasing',
  'search': 'Search',
  'chat': 'Chat',
  'code-generation': 'Code Generation',
  'question-answering': 'Question Answering',
  'sentiment-analysis': 'Sentiment Analysis',
  'image-generation': 'Image Generation',
  'image-to-text-classification': 'Image-to-Text & Image Classification',
  'personalization': 'Personalization',
  'fine-tuning': 'Model Fine Tuning',
  'classification-NER': 'Named Entity Recognition & Classification',
  'data-labeling': 'Data Labeling',
  'best-practices': 'Generative AI Best Practices'
}

const mapUseCaseName = (useCaseName) => {
  const mapped = useCaseMapping[useCaseName]
  if(!mapped){
    console.error('ERROR: missing mapping for use case label:', useCaseName)
  }
  return mapped
}

export const aggregateUseCases = (useCases) => {
  return useCases?.map(mapUseCaseName)?.join(", ") || ""
}


const collectUseCases = (resource) => {

  const useCaseLabels = ["Use case 1", "Use case 2", "Use case 3", "Use case 4", "Use case 5", "Use case 6", "Use case 7", "Use case 8", "Use case 9", "Use case 10"]
  
  const useCases = []
  useCaseLabels.forEach(label => {
    if(resource?.[label]?.length > 0){
      useCases.push(resource?.[label])
    }
  })
  return useCases

}

export const mapResourceFields = async (resource) => {
  if(!resource || !resource["Content title"]){ return {} }

  const imageUrl = resource["Image URL"] === "Notebook icon TBD" ? null  : resource["Image URL"]
  let imgDim = null
  try{
    imgDim = imageUrl ? await getImageSize(imageUrl) : null
  }catch(err){
    console.log("error")
    console.log(err)
    imgDim = null
  }

  return {
    name: resource["Content title"],
    alt: "First",
    url: resource.URL,
    useCases: collectUseCases(resource),
    type: resource["Content type"],
    update: resource["Publication date (MM/DD/YYYY)"],
    imageUrl,
    imgDim
  }
}

const useCasesOptions = [
  // this should better be dynamic
  { label: 'text-generation', value: '1' },
  { label: 'summarization-paraphrasing', value: '2' },
  { label: 'search', value: '3' },
  { label: 'chat', value: '4' },
  { label: 'code-generation', value: '5' },
  { label: 'question-answering', value: '6' },
  { label: 'sentiment-analysis', value: '7' },
  { label: 'image-generation', value: '8' },
  { label: 'image-to-text-classification', value: '9' },
  { label: 'personalization', value: '10' },
  { label: 'fine-tuning', value: '11' },
  { label: 'classification-NER', value: '12' },
  { label: 'data-labeling', value: '13' },
  { label: 'best-practices', value: '14'}
]

export const prepareUseCasesOptions = (defaultUseCase) => [defaultUseCase, ...useCasesOptions.map(option => ({ ...option, rawLabel: option.label, label: mapUseCaseName(option.label)}))]

const contentTypesOptions = [
  // this should better be dynamic
  { label: 'blog', value: '1' },
  { label: 'workshop', value: '2' },
  { label: 'video', value: '3' },
  { label: 'jumpstart', value: '4' },
]

export const prepareContentTypesOptions = (defaultContentType) => [defaultContentType, ...contentTypesOptions.map(option => ({...option, rawLabel: option.label, label: mapContentTypeName(option.label)}))]

export const includesUseCase = (useCases, selectedUseCase) => useCases?.includes(selectedUseCase.rawLabel) || false

export const SEARCHABLE_COLUMNS = [ 'name', 'url', 'useCases', 'type', 'update', 'imageUrl' ]

export const getTextFilterCounterText = (count) => `${count} ${count === 1 ? 'match' : 'matches'}`

export const paginationAriaLabels = (totalPages) => ({
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of ${totalPages || 'all pages'}`,
})

export const visiblePreferencesOptions = [
  { id: "url", label: "Url" },
  { id: "useCases", label: "Use cases" },
  { id: "type", label: "Content type" },
  { id: "update", label: "Date" },
  { id: "image", label: "Image" }
]
export const visibleContent = [ "url", "useCases", "type", "update", "image" ]

export const getNumberOfVisibleItems = (filteredItemsCount, currentPage, totalPages, pageSize, totalResources) => {
  return filteredItemsCount
  ? `(${filteredItemsCount}/${totalResources})`
  : `(${totalResources})`
}