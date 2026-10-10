import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES} from './schemaTypes/registry'
import {structure} from './structure'
import {placeholdersTool} from './tools/placeholders'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'e1ib49ry'
const dataset = process.env.SANITY_STUDIO_DATASET || 'development'

/** Singletons can be edited and published, never created, duplicated or deleted from the Studio. */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Hopsig',

  projectId,
  dataset,

  plugins: [structureTool({structure}), placeholdersTool(), visionTool()],

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
