import {collections} from './documents/collections'
import {basics} from './objects/basics'
import {pageObjects, pages} from './singletons/pages'
import {siteSingletons} from './singletons/site'

export const schemaTypes = [...basics, ...pageObjects, ...collections, ...siteSingletons, ...pages]
