import { ExpandDeep, ShapedNamed } from './primitives'

export type User = ExpandDeep<ShapedNamed<'User'>>
export type Profile = ExpandDeep<ShapedNamed<'Profile'>>
export type Entry = ExpandDeep<ShapedNamed<'Entry'>>

export interface OtherGraphItem extends Entry {
	user_nicename: string
	spiritual_name: string
	karmic_name: string
	city: string
	country: string
	avatarUrl: string
	user_id: string
}

export type EntryInputFields = ExpandDeep<ShapedNamed<'EntryInputFields'>>

export type YMD = string // Year Month Day
