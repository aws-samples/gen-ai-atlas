import { useEffect, useState } from "react";
import { getImageSize } from 'react-image-size';
import { contentTypeMapping, contentTypesOptions, useCaseMapping, useCasesOptions } from "./constants";

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

const getImgDim = async (imageUrl) => {
  let imgDim = null
  try{
    imgDim = imageUrl ? await getImageSize(imageUrl) : null
  }catch(err){
    console.log("error")
    console.log(err)
    imgDim = null
  }
  return imgDim
}

export const mapContentTypeName = (typeName) => {
  const mapped = contentTypeMapping[typeName]
  if(!mapped){
    console.error('ERROR: missing mapping for content type label:', typeName)
  }
  return mapped
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
  const imgDim =  await getImgDim(imageUrl)

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

export const prepareUseCasesOptions = () => [...useCasesOptions.map(option => ({ ...option, rawLabel: option.label, label: mapUseCaseName(option.label)}))]

export const prepareContentTypesOptions = (defaultContentType) => [defaultContentType, ...contentTypesOptions.map(option => ({...option, rawLabel: option.label, label: mapContentTypeName(option.label)}))]

export const includesUseCase = (useCases, selectedUseCases) => {
  // if no use cases have been selected, return true
  let match = selectedUseCases?.length === 0 || false
  selectedUseCases.filter(selectedUseCase => selectedUseCase?.rawLabel != null).forEach(selectedUseCase => {
    if(useCases?.includes(selectedUseCase?.rawLabel)){ 
      match = true 
      return
    }
  })
  return match
}

export const getTextFilterCounterText = (count) => `${count} ${count === 1 ? 'match' : 'matches'}`

export const paginationAriaLabels = (totalPages) => ({
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of ${totalPages || 'all pages'}`,
})

export const getNumberOfVisibleItems = (filteredItemsCount, currentPage, totalPages, pageSize, totalResources) => {
  return filteredItemsCount
  ? `(${filteredItemsCount}/${totalResources})`
  : `(${totalResources})`
}

export const getUseCaseFromQueryParamIfExists = (param) => {
  const array = JSON.parse(JSON.stringify("[" + (param || '') + "]"))
  const selectUseCaseOptions = prepareUseCasesOptions()
  return selectUseCaseOptions.filter(option => array?.includes(option.rawLabel)) || []
}

export const getContentTypeFromQueryParamIfExists = (param, defaultContentType) => {
  const selectContentTypesOptions = prepareContentTypesOptions(defaultContentType);
  return selectContentTypesOptions.filter(option => option.rawLabel === param)?.[0] || defaultContentType
}