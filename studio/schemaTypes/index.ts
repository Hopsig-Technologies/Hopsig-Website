import {collections} from './documents/collections'
import {basics} from './objects/basics'
import {siteSingletons} from './singletons/site'

/** Sanity holds only what changes without a developer: case studies, notes, roles and the site-wide values.
 *  Every other page's copy lives in web/content. */
export const schemaTypes = [...basics, ...collections, ...siteSingletons]
