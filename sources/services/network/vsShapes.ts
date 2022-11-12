// prettier-ignore
import {  r,  shape } from 'shared/types/shapeTool'
import { Expand, primitiveTypes, Shaped } from 'shared/types/primitives'
import { EntryInputFields, Entry } from 'shared/types/shapes'

const { string, number } = primitiveTypes

export const sTokens = shape({
	access_token: r(string),
	refresh_token: r(string),
})

export type Tokens = Expand<Shaped<typeof sTokens>>

export const LoginParams = shape({
	username: r(string),
	password: r(string),
	grant_type: r(string),
	client_id: r(string),
	client_secret: r(string),
})

export const EntriesRequest = shape({
	modified_since: string,
})

export const MonthEntriesRequest = shape({
	year: r(number),
	month: r(number),
})

export const PostEntry = shape({
	entrydate: r(string),
	...EntryInputFields,
})

export const EntryID = shape({
	entry_id: r(string),
})

export const UpdateEntry = shape({
	...EntryID,
	...PostEntry,
})

export const EntriesResponse = shape({
	entries: r([Entry]),
	filter: r({
		page_num: number,
		items_per_page: number,
	}),
})

export const Registration = shape({
	spiritual_name: string,
	first_name: r(string),
	last_name: r(string),
	password: r(string),
	email: r(string),
})

export const UserID = shape({
	user_id: r(string),
})
