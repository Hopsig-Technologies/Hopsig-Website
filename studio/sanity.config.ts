import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES} from './schemaTypes/registry'
import {structure} from './structure'
import {placeholdersTool} from './tools/placeholders'
import {resolve} from './presentation/resolve'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'e1ib49ry'
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'
/** The site the Presentation tool previews (draft mode via /api/draft-mode/enable). */
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://hopsig-website.vercel.app'

/** Singletons can be edited and published, never created, duplicated or deleted from the Studio. */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Hopsig',

  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({resolve, previewUrl: {initial: previewUrl, previewMode: {enable: '/api/draft-mode/enable'}}}),
    placeholdersTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !SINGLETON_TYPES.has(t.schemaType)),
  },

  document: {
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType) ? prev.filter(({action}) => action && SINGLETON_ACTIONS.has(action)) : prev,
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETON_TYPES.has(item.templateId)),
  },
})
