import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'
import {definePlugin} from 'sanity'
import {PlaceholdersTool} from './PlaceholdersTool'

/** A Studio tab listing every bracketed placeholder still in the content (rule 1, IMPLEMENTATION_PLAN.md). */
export const placeholdersTool = definePlugin({
  name: 'hopsig-placeholders',
  tools: [{name: 'placeholders', title: 'Placeholders', icon: WarningOutlineIcon, component: PlaceholdersTool}],
})
