import {
  initPlasmicLoader,
  PlasmicRootProvider,
  PlasmicComponent,
  ComponentRenderData,
  extractPlasmicQueryData,
} from '@plasmicapp/loader-nextjs'
import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Error from 'next/error'

const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: 'PROJECTID', // ID of a project you are using
      token: 'APITOKEN', // API token for that project
    },
  ],
  // Setting this to true fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  // preview: true,
})

/**
 * Use fetchPages() to fetch list of pages that have been created in Plasmic
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await PLASMIC.fetchPages()
  return {
    paths: pages.map((page) => ({
      params: { plasmicPath: page.path.substring(1).split('/') },
    })),
    fallback: 'blocking',
  }
}

/**
 * For each page, pre-fetch the data we need to render it
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const { plasmicPath } = context.params ?? {}

  // Convert the catchall param into a path string
  const plasmicPath =
    typeof catchall === 'string'
      ? catchall
      : Array.isArray(catchall)
      ? `/${catchall.join('/')}`
      : '/'
  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath)
  if (!plasmicData) {
    // This is some non-Plasmic catch-all page
    return { props: {} }
  }
  // This is a path that Plasmic knows about
  // Cache the necessary data fetched for the page
  const queryCache = await extractPlasmicQueryData(
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
    </PlasmicRootProvider>
  )
  // Pass the data and cache in as props
  // Using incremental static regeneration, will re-generate this page
  // after 300s
  return { props: { plasmicData, queryCache }, revalidate: 300 }
}

/**
 * Actually render the page!
 */
export default function CatchallPage(props: {
  plasmicData?: ComponentRenderData
  queryCache?: Record<string, any>
}) {
  const { plasmicData, queryCache } = props
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />
  }
  const pageMeta = plasmicData.entryCompMetas[0]
  return (
    // Pass in the data and queries fetched in getStaticProps as prefetchedData and prefetchedQueryData
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
      prefetchedQueryData={queryCache}
    >
      {
        // plasmicData.entryCompMetas[0].name contains the name
        // of the component you fetched.
      }
      <PlasmicComponent component={pageMeta.name} />
    </PlasmicRootProvider>
  )
}
