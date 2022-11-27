import { utcStringFromDate } from 'shared/dateUtil'
import { User, Profile, Entry } from 'shared/types'
import { Shaped, ShapeName, primitiveTypes } from 'shared/types/primitives'
import { shape } from 'shared/types/shapeTool'
import { setupDB, SQLDB, Table } from './sqlite'
import { SQLSchema } from './sqlite/types'

const { string, boolean } = primitiveTypes

const useShapes = <SN extends ShapeName>(...names: SN[]) => names

const usedShapeNames = useShapes('User', 'Entry', 'KeyValue', 'EntryUpdatedDates', 'Profile')

type UsedShapeNames = typeof usedShapeNames[number]

const schema: SQLSchema<UsedShapeNames> = {
	User: {},
	Profile: {},
	Entry: {
		unique: [['user_id', 'date']],
		index: [['user_id', 'dateSynced']],
	},
	KeyValue: {},
	EntryUpdatedDates: {},
}

let db: SQLDB<UsedShapeNames>
let users: Table<'User'>
let profiles: Table<'Profile'>
let entries: Table<'Entry'>

export const initLocalDB = async () => {
	db = await setupDB(schema)
	users = db.table('User')
	profiles = db.table('Profile')
	entries = db.table('Entry')
}

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
	entry: Partial<Omit<Entry, 'user_id' | 'date' | 'dateSynced' | 'created_at'>>,
) =>
	entries
		.update({ ...entry, updated_at: utcStringFromDate(new Date()) })
		.match({ user_id, date })
		.run()

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

export const setValueToLocalStore = <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
	value: V,
) => db.table('KeyValue').insert({ key, value })

export const getValueFromLocalStore = async <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
): Promise<V | null> => {
	const [row] = await db.table('KeyValue').select('value').match({ key }).run()
	return row?.value ?? null
}

export const setObjectToLocalStore = <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
	object: V,
) => db.table('KeyValue').insert({ key, object })

export const getObjectFromLocalStore = async <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
) => {
	const [row] = await db.table('KeyValue').select('object').match({ key }).run()
	return (row?.object ?? null) as V | null
}

export const removeItemFromLocalStore = async <K extends keyof LocalStore>(key: K) => {
	return db.table('KeyValue').delete().where('key', '=', key).run()
}

export const clearLocalStore = () => db.table('KeyValue').delete().run()
