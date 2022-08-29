import { ExpandDeep, ShapedNamed } from './primitives'

export type User = ExpandDeep<ShapedNamed<'User'>>
export type Entry = ExpandDeep<ShapedNamed<'Entry'>>
