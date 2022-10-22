import { ExpandDeep, ShapedNamed } from './primitives'

export type User = ExpandDeep<ShapedNamed<'User'>>
export type Entry = ExpandDeep<ShapedNamed<'Entry'>>
export type EntryInputFields = ExpandDeep<ShapedNamed<'EntryInputFields'>>

export type YMD = string
