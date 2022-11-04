// prettier-ignore
import { r, p, _,  shape } from './shapeTool'
import { primitiveTypes } from './primitives'

const { string, boolean, any } = primitiveTypes

export const CustomField = shape({
	name: r(string),
	type: r(string),
	id: r(string, 'local'),
})

export const User = shape({
	userid: p(string),
	user_name: string,
	user_nicename: string,
	cfg_public: boolean,
	cfg_showmoresixteen: boolean,
	opt_wake: boolean,
	opt_service: boolean,
	opt_exercise: boolean,
	opt_lections: boolean,
	opt_sleep: boolean,
	avatar_url: string,
	entriesDate: _(string, 'local'),
})

export const EntryInputFields = shape({
	jcount_730: string,
	jcount_1000: string,
	jcount_1800: string,
	jcount_after: string,
	reading: string,
	kirtan: string,
	opt_sleep: string,
	opt_wake_up: string,
	opt_exercise: string,
	opt_service: string,
	opt_lections: string,
})

// TODO: remove primary key from ID. It should be pair userId - date.
// BC some entries will be unsynchonized, without id, but we still need to store it in the local DB

export const Entry = shape({
	id: string,
	created_at: r(string),
	updated_at: r(string),
	user_id: r(string),
	date: r(string), // YMD
	day: r(string),
	...EntryInputFields,

	dateSynced: _(string, 'local'),
})

export const KeyValue = shape({
	key: p(string),
	value: any,
	object: {},
})

export const EntryUpdatedDates = shape({
	userID: p(string),
	date: string,
})
