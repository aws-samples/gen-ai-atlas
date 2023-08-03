import React, { useEffect } from 'react';
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import Link from "@cloudscape-design/components/link";

import { useCollection } from '@cloudscape-design/collection-hooks';

import {
    AppLayout, ColumnLayout, FormField, Input, Select, SpaceBetween,
} from "@cloudscape-design/components";


import Navigation from "../components/Navigation";
import { appLayoutLabels} from '../components/Labels';
import { SEARCHABLE_COLUMNS, aggregateUseCases, getNumberOfVisibleItems, getTextFilterCounterText, includesUseCase, mapContentTypeName, mapResourceFields, paginationAriaLabels, prepareContentTypesOptions, prepareUseCasesOptions, visibleContent, visiblePreferencesOptions } from '../components/utils'
import { CardsEmptyState, CardsNoMatchState } from '../components/Cards';

import Papa from "papaparse";
const csvFile = process.env.PUBLIC_URL + '/atlas.csv'
const rectangle = process.env.PUBLIC_URL + '/rectangle_grey.png'
const repoImage = process.env.PUBLIC_URL + '/image.png'

const defaultUseCase = { value: '0', label: 'Any use case' };
const defaultContentType = { value: '0', label: 'Any content type' };

const selectUseCaseOptions = prepareUseCasesOptions(defaultUseCase);
const selectContentTypesOptions = prepareContentTypesOptions(defaultContentType);

function matchesUseCase(item, selectedUseCase) {
  return selectedUseCase === defaultUseCase || includesUseCase(item.useCases, selectedUseCase)
}

function matchesContentType(item, selectedContentType) {
  return selectedContentType === defaultContentType || item.type === selectedContentType.rawLabel
}

const Content = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ selectedItems, setSelectedItems ] = React.useState([{ }]);
    const [ preferences, setPreferences ] = React.useState({ pageSize: 12, visibleContent })
    const [ resources, setResources ] = React.useState([])
    const [ useCase, setUseCase ] = React.useState(defaultUseCase);
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
    }, [])

    const { items, actions, filteredItemsCount, filterProps, paginationProps } = useCollection(
        resources,
        {
          filtering: {
            empty: <CardsEmptyState />,
            noMatch: <CardsNoMatchState onClearFilter={clearFilter} />,
            filteringFunction: (item, filteringText) => {
              if (!matchesUseCase(item, useCase)) {
                return false;
              }
              if (!matchesContentType(item, contentType)) {
                return false;
              }
              const filteringTextLowerCase = filteringText.toLowerCase();
      
              return SEARCHABLE_COLUMNS.map(key => item[key]).some(
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
        setUseCase(defaultUseCase);
        setContentType(defaultContentType);
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
                      actions.setFiltering(event.detail.value);
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
                    <Select
                      data-testid="use-case-filter"
                      options={selectUseCaseOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={useCase}
                      onChange={event => {
                        setUseCase(event.detail.selectedOption);
                      }}
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
                        setContentType(event.detail.selectedOption);
                      }}
                      ariaDescribedby={null}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
              </ColumnLayout>
              <div aria-live="polite">
                {(filterProps.filteringText || contentType !== defaultContentType || useCase !== defaultUseCase) && (
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
                    options: visiblePreferencesOptions
                  }
                ]
              }}
            />
          }
        />
      );
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
            />
        </div>
    );
}
