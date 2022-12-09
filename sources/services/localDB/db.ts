import { utcStringFromDate } from 'shared/dateUtil'
import { User, Profile, Entry } from 'shared/types'
import { Shaped, primitiveTypes, Expand } from 'shared/types/primitives'
import { KeyValue } from 'shared/types/shapes'
import { shape } from 'shared/types/shapeTool'
import { isObject } from 'shared/types/utils'
import { preInitDB } from './sqlite'

const { string, boolean } = primitiveTypes

const db = preInitDB({
	User: {},
	Entry: {
		unique: [['user_id', 'date']],
		index: [['user_id', 'dateSynced']],
	},
	KeyValue: {},
	EntryUpdatedDates: {},
	Profile: {},
})

const { User: users, Profile: profiles, Entry: entries } = db.tables

export const init = () => db.init()

export const insertUsers = (..._: User[]) => users.insert(..._)
export const updateUser = (userid: string, update: Partial<Omit<User, 'userid'>>) =>
	users.update(update).match({ userid }).run()
export const fetchUsers = () => users.select().run()
export const fetchUser = (userid: string) =>
	users
		.select()
		.match({ userid })
		.run()
		.then((_) => _[0])

export const insertProfile = (profile: Profile) => profiles.insert(profile)
export const fetchProfiles = () => profiles.select().run()

export const insertEntries = (_: Entry[]) => entries.insert(..._)

export const updateEntry = (
	user_id: string,
	date: string,
	entry: Partial<Omit<Entry, 'user_id' | 'date' | 'created_at'>>,
) => entries.update(entry).match({ user_id, date }).run()

export const fetchEntries = (user_id: string) =>
	entries.select().match({ user_id }).orderBy('date DESC').run()

export const allEntriesCount = () => entries.aggregate('COUNT(*)').run()
// prettier-ignore
export const entriesToSync = (user_id: string) =>
	entries
		.select()
		.match({ user_id })
		.where('dateSynced', 'IS', 'NULL')
		.or('dateSynced', '<', 'updated_at', true)
		.run()

export const setEntryUpdatedDateForUser = async (userID: string, date: string) =>
	db.table('EntryUpdatedDates').insert({ userID, date })

export const entryUpdatedDateForUser = async (userID: string) => {
	const result = await db.table('EntryUpdatedDates').select('date').match({ userID }).run()
	return result[0]?.date
}

const LocalStoreShape = shape({
	myID: string,
	wakeUpEnabled: boolean,
	serviceEnabled: boolean,
	yogaEnabled: boolean,
	lectionsEnabled: boolean,
	bedEnabled: boolean,
	readingInMinutes: boolean,
	favorites: [string],
})

type LocalStore = Shaped<typeof LocalStoreShape>

export const fetchLocalStore = async () => {
	const result = await db.table('KeyValue').select().run()

	const localStore: LocalStore = {}
	result.forEach((row) => {
		// @ts-ignore
		localStore[row.key] = row.value ?? row.object
	})
	return localStore
}

export const setLocal = <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: string & K,
	value: V,
) => {
	const row: Expand<Shaped<typeof KeyValue>> = { key }

	if (isObject(LocalStoreShape, key)) row.object = value
	else row.value = value

	return db.table('KeyValue').insert(row)
}

export const getLocal = async <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
): Promise<V | null> => {
	const rowKey: keyof Shaped<typeof KeyValue> = isObject(LocalStoreShape, key) ? 'object' : 'value'
	const [row] = await db.table('KeyValue').select(rowKey).match({ key }).run()
	return row?.[rowKey]
}

export const getLocals = async <K extends keyof LocalStore>(
	...keys: K[] | (keyof LocalStore)[]
) => {
	const rows = await db.table('KeyValue').select('key').where('key', 'IN', keys).run()
	const object = {} as Pick<LocalStore, K>
	// @ts-ignore
	rows.forEach((row) => (object[row.key] = row.value ?? row.object))
	return object
}

export const removeLocal = async <K extends keyof LocalStore>(key: K) => {
	return db.table('KeyValue').delete().where('key', '=', key).run()
}

export const clearLocalStore = () => db.table('KeyValue').delete().run()
