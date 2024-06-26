"use client";

import React, { useEffect } from 'react';
import { useSearchParams  } from 'react-router-dom';

import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import Link from "@cloudscape-design/components/link";
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
    AppLayout, ColumnLayout, ContentLayout, FormField, Input, Multiselect, Select, SpaceBetween,
} from "@cloudscape-design/components";


import Navigation from "../components/Navigation";
import { appLayoutLabels} from '../components/Labels';
import { aggregateUseCases, getContentTypeFromQueryParamIfExists, getNumberOfVisibleItems, getTextFilterCounterText, getUseCaseFromQueryParamIfExists, includesUseCase, mapContentTypeName, mapResourceFields, paginationAriaLabels, prepareContentTypesOptions, prepareUseCasesOptions } from '../components/utils'
import { CardsEmptyState, CardsNoMatchState } from '../components/Cards';
import { SEARCHABLE_COLUMNS_CARDS, cardsVisibleContent, cardsVisiblePreferencesOptions } from '../components/constants';

import Papa from "papaparse";
import { HomeBreadcrumbs } from '../components/Breadcrumbs';
const csvFile = '/atlas.csv'
const rectangle = '/rectangle_grey.png'
const repoImage = '/image.png'

const defaultUseCase = { value: '0', label: 'Any use case', rawLabel: 'default' };
const defaultContentType = { value: '0', label: 'Any content type', rawLabel: 'default' };

const selectUseCaseOptions = prepareUseCasesOptions();
const selectContentTypesOptions = prepareContentTypesOptions(defaultContentType);

function matchesUseCase(item, selectedUseCase) {
  return includesUseCase(item.useCases, selectedUseCase)
}

function matchesContentType(item, selectedContentType) {
  return selectedContentType === defaultContentType || item.type === selectedContentType.rawLabel
}

const CardsContent = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [ loading, setLoading ] = React.useState(false);
    const [ selectedItems, setSelectedItems ] = React.useState([{ }]);
    const [ preferences, setPreferences ] = React.useState({ pageSize: 12, visibleContent: cardsVisibleContent })
    const [ resources, setResources ] = React.useState([])
    const [ useCases, setUseCases ] = React.useState([]);
    const [ contentType, setContentType ] = React.useState(defaultContentType);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)

        Papa.parse(csvFile, {
          header: true,
          skipEmptyLines: true,
          download: true,

          error: function(error) {
            console.log("Error in loading the CSV file")
            console.log(error.message);
            console.log(csvFile)
          },

          complete: async function (results) {
              const rowsArray = [];

              results.data.forEach((d) => {
                  rowsArray.push(Object.keys(d));
              });

              const transformedResults = await Promise.all( 
                results.data?.filter(res => res?.["Content title"])
                  ?.map(
                    async res => await mapResourceFields(res))
              )
              console.log({transformedResults})
              setResources(transformedResults)

              setLoading(false)
          },
      });
      }

      fetchData().catch(console.error);

      const searchUseCaseValue = searchParams.get('use-case');
      const useCasesToSelect = getUseCaseFromQueryParamIfExists(searchUseCaseValue)
      setUseCases(useCasesToSelect)
      
      const searchContentTypeValue = searchParams.get('content-type');
      const contentTypeToSelect = getContentTypeFromQueryParamIfExists(searchContentTypeValue, defaultContentType)
      setContentType(contentTypeToSelect)

      const searchText = searchParams.get('text')
      if(searchText){ actions.setFiltering(searchText) }

      const refinedQuery = {
        ...(searchUseCaseValue ? {useCaseQuery: useCasesToSelect?.map(c => c?.rawLabel)}: {}),
        ...(searchContentTypeValue ? {contentTypeQuery: contentTypeToSelect?.rawLabel}: {}),
        textFilter: searchText
      }
      addQueryParams(refinedQuery)

    }, [])

    const { items, actions, filteredItemsCount, filterProps, paginationProps } = useCollection(
        resources,
        {
          filtering: {
            empty: <CardsEmptyState />,
            noMatch: <CardsNoMatchState onClearFilter={clearFilter} />,
            filteringFunction: (item, filteringText) => {
              if (!matchesUseCase(item, useCases)) {
                return false;
              }

              if (!matchesContentType(item, contentType)) {
                return false;
              }

              const filteringTextLowerCase = filteringText.toLowerCase();
              return SEARCHABLE_COLUMNS_CARDS.map(key => item[key]).some(
                value => typeof value === 'string' && value.toLowerCase().indexOf(filteringTextLowerCase) > -1
              );
            },
          },
          pagination: { pageSize: preferences.pageSize },
          selection: {},
        }
      );

    function clearFilter() {
      actions.setFiltering('');
      setUseCases([]);
      setContentType(defaultContentType);
    }

    const addQueryParams = (query) => {
      const { textFilter, useCaseQuery, contentTypeQuery } = query
      const useCaseParam = (useCaseQuery || useCases?.map(c => c.rawLabel) || []).join()
      const contentTypeParam = contentTypeQuery || contentType?.rawLabel
      const textParam = textFilter ?? filterProps.filteringText

      const queryParams = {
        ...(textParam ? { "text": textParam } : {} ),
        ...(useCaseParam?.length > 0 ? { "use-case": useCaseParam } : {} ),
        ...(contentTypeParam !== defaultContentType.rawLabel ? { "content-type": contentTypeParam } : {} )
      }

      setSearchParams(queryParams)
    }

    return (
        <Cards
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          selectedItems={selectedItems}
          ariaLabels={{
            itemSelectionLabel: (e, n) => `select ${n.name}`,
            selectionGroupLabel: "Item selection"
          }}
          stickyHeader={false}
          cardDefinition={{
            header: e => e.name,
            sections: [
                {
                  id: "image",
                  content: e =>   
                  {
                    let width = '100%'
                    if(e.imageUrl && (e.imgDim?.width < e.imgDim?.height)){
                      width = '50%'
                    }
            
                    return <Box textAlign='center'>
                      { 
                        !e.imgDim ? 
                          <img src={rectangle} alt="" width='100%'/> :                     
                          <img src={e.imageUrl} alt=""  width={width}/>
                      }
                    </Box>}
                },
                {
                    id: "url",
                    content: e => <Link href={e.url} external >Open</Link>
                },
                {
                    id: "useCases",
                    header: "Use cases",
                    content: e => aggregateUseCases(e.useCases)
                },
                {
                    id: "type",
                    header: "Content type",
                    content: e => mapContentTypeName(e.type),
                    width: 50
                },
                {
                    id: "update",
                    header: "Date",
                    content: e => e.update,
                    width: 50
                },
            ]
          }}
          cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 2 }, 
            { minWidth: 800, cards: 3 },
            { minWidth: 1200, cards: 4 }
          ]}
          items={items}
          loading={loading}
          loadingText="Loading resources"
          trackBy="name"
          visibleSections={preferences.visibleContent}
          empty={
            <CardsEmptyState />
          }
          filter={
            <div className="input-container">
              <div className="input-filter">
                <FormField label="Search by keyword">
                  <Input
                    data-testid="input-filter"
                    type="search"
                    value={filterProps.filteringText}
                    onChange={event => {
                      const textFilter = event.detail.value
                      actions.setFiltering(textFilter);

                      addQueryParams({ textFilter })
                    }}
                    placeholder="Enter a keyword"
                    clearAriaLabel="clear"
                    ariaDescribedby={null}
                    disabled={loading}
                  />
                </FormField>
              </div>
              <ColumnLayout columns={2}>
                <div className="select-filter">
                  <FormField label="Filter by use case">
                    <Multiselect
                      data-testid="use-case-filter"
                      options={selectUseCaseOptions}
                      selectedAriaLabel="Selected"
                      selectedOptions={useCases}
                      onChange={event => {
                        const selectedUseCases = event.detail.selectedOptions
                        setUseCases(selectedUseCases);

                        const useCaseQuery = selectedUseCases?.map(c => c?.rawLabel)
                        addQueryParams({ useCaseQuery })

                      }}
                      placeholder={defaultUseCase.label}
                      ariaDescribedby={null}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
                <div className="select-filter">
                  <FormField label="Filter by content type">
                    <Select
                      data-testid="content-type-filter"
                      options={selectContentTypesOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={contentType}
                      onChange={event => {
                        const selectedContentType = event.detail.selectedOption
                        setContentType(selectedContentType);

                        const contentTypeQuery = selectedContentType?.rawLabel
                        addQueryParams({ contentTypeQuery }) 
                        
                      }}
                      ariaDescribedby={null}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
              </ColumnLayout>
              <div aria-live="polite">
                {(filterProps.filteringText || contentType !== defaultContentType || useCases?.length !== 0) && (
                  <span className="filtering-results">{getTextFilterCounterText(filteredItemsCount)}</span>
                )}
              </div>
            </div>
          }
          header={
            
            <SpaceBetween direction="vertical" size="s">
              <Header
                counter={
                  getNumberOfVisibleItems(filteredItemsCount, paginationProps.currentPageIndex, paginationProps.pagesCount, preferences.pageSize, resources.length)
                }
              >
                Generative AI Atlas
              </Header>
              <text>
                The Generative AI Atlas is an organized repository that gathers the latest resources related to Generative AI published on official AWS channels, including Blog Posts, Code Samples, Tutorials, Videos, and Workshops. Whether you’re a beginner or an experienced practitioner, the Generative AI Atlas presents a curated selection of content to support your journey.
              </text>
              <img src={repoImage} alt="" width='100%'/>
            </SpaceBetween>
            
          }

          pagination={<Pagination {...paginationProps} ariaLabels={paginationAriaLabels(paginationProps.pagesCount)} />}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              onConfirm={({ detail }) => setPreferences(detail)}
              cancelLabel="Cancel"
              preferences={preferences}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 6, label: "6 resources" },
                  { value: 8, label: "8 resources" },
                  { value: 12, label: "12 resources" }
                ]
              }}
              visibleContentPreference={{
                title: "Select visible content",
                options: [
                  {
                    label: "Main distribution properties",
                    options: cardsVisiblePreferencesOptions
                  }
                ]
              }}
            />
          }
        />
      );
}


const Content = () => {
  return (
      <ContentLayout
          header={
              <Header
              variant="h1">
              Explore and Search
            </Header>
          }
        >
          <SpaceBetween size="l">
              <CardsContent />
          </SpaceBetween>
      </ContentLayout>
  )
}

export function LandingPage(props) {

  return (
      <div>
          <AppLayout
              content={<Content />}
              navigation={<Navigation setNavigationOpen={props.setNavigationOpen}/>}
              navigationOpen={props.navigationOpen}
              onNavigationChange={({ detail }) => props.setNavigationOpen(detail.open)}
              toolsHide={true}
              ariaLabels={appLayoutLabels}
              breadcrumbs={<HomeBreadcrumbs />}
          />
      </div>
  );
}