import {defineArrayMember, defineField} from 'sanity'
import {placeholderWarning} from './validation'

/** Field helpers. Every text field carries the placeholder warning (rule 1), so it is added here once. */

type Opts = {
  title?: string
  description?: string
  required?: boolean
  rows?: number
  hidden?: boolean
  readOnly?: boolean
  group?: string
  fieldset?: string
  initialValue?: string
}

function rules(required?: boolean) {
  return (rule: any) => {
    const warn = rule.custom(placeholderWarning).warning()
    return required ? [rule.required(), warn] : [warn]
  }
}

/** One line of copy. */
export const str = (name: string, o: Opts = {}) =>
  defineField({
    name,
    type: 'string',
    title: o.title,
    description: o.description,
    hidden: o.hidden,
    readOnly: o.readOnly,
    group: o.group,
    fieldset: o.fieldset,
    initialValue: o.initialValue,
    validation: rules(o.required),
  })

/** Copy that may wrap or carry line breaks (a newline renders as a line break, e.g. hero titles). */
export const txt = (name: string, o: Opts = {}) =>
  defineField({
    name,
    type: 'text',
    rows: o.rows ?? 2,
    title: o.title,
    description: o.description,
    hidden: o.hidden,
    readOnly: o.readOnly,
    group: o.group,
    fieldset: o.fieldset,
    initialValue: o.initialValue,
    validation: rules(o.required),
  })

/** A list of single lines (bullets, chips, tags). */
export const strList = (name: string, o: Opts = {}) =>
  defineField({
    name,
    type: 'array',
    title: o.title,
    description: o.description,
    group: o.group,
    fieldset: o.fieldset,
    of: [defineArrayMember({type: 'string', validation: rules(false)})],
  })

/** An array of one object type. */
export const list = (name: string, type: string, o: Opts & {min?: number; max?: number} = {}) =>
  defineField({
    name,
    type: 'array',
    title: o.title,
    description: o.description,
    group: o.group,
    fieldset: o.fieldset,
    of: [defineArrayMember({type})],
    validation: (rule: any) => {
      let r = rule
      if (o.min !== undefined) r = r.min(o.min)
      if (o.max !== undefined) r = r.max(o.max)
      return r
    },
  })

/** A nested object field of a named object type. */
export const obj = (name: string, type: string, o: Opts = {}) =>
  defineField({name, type, title: o.title, description: o.description, group: o.group, fieldset: o.fieldset})
