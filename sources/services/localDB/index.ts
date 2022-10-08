import { utcStringFromDate } from 'shared/dateUtil'
import { User, Entry } from 'shared/types'
import { Shaped, ShapeName, primitiveTypes } from 'shared/types/primitives'
import { shape } from 'shared/types/shapeTool'
import { setupDB, SQLDB, Table } from './sqlite'
import { SQLSchema } from './sqlite/types'

const { string } = primitiveTypes

const useShapes = <SN extends ShapeName>(...names: SN[]) => names

const usedShapeNames = useShapes('User', 'Entry', 'KeyValue', 'EntryUpdatedDates')

type UsedShapeNames = typeof usedShapeNames[number]

const schema: SQLSchema<UsedShapeNames> = {
	User: {},
	Entry: {
		unique: [['user_id', 'date']],
		index: [['user_id', 'dateSynced']],
	},
	KeyValue: {},
	EntryUpdatedDates: {},
}

let db: SQLDB<UsedShapeNames>

let entriesTable: Table<'Entry'>

export const initLocalDB = async () => {
	db = await setupDB(schema)
	entriesTable = db.table('Entry')
}

export const insertUsers = (...users: User[]) => db.table('User').insert(...users)

export const insertEntries = (entries: Entry[]) => db.table('Entry').insert(...entries)

export const updateEntry = (
	user_id: string,
	date: string,
	entry: Partial<Omit<Entry, 'user_id' | 'date' | 'dateSynced' | 'created_at'>>,
) =>
	db
		.table('Entry')
		.update({ ...entry, updated_at: utcStringFromDate(new Date()) })
		.match({ user_id, date })
		.run()

export const entries = (user_id: string) =>
	db.table('Entry').select().match({ user_id }).orderBy('date DESC').fetch()

export const allEntriesCount = () => entriesTable.aggregate('COUNT(*)').fetch()
// prettier-ignore
export const entriesToSync = (user_id: string) =>
	db.table('Entry')
		.select()
		.match({ user_id })
		.where('dateSynced', 'IS', 'NULL')
		.or('dateSynced', '<', 'updated_at', true)
		.fetch()

export const setEntryUpdatedDateForUser = async (userID: string, date: string) =>
	db.table('EntryUpdatedDates').insert({ userID, date })

export const entryUpdatedDateForUser = async (userID: string) => {
	const result = await db.table('EntryUpdatedDates').select('date').match({ userID }).fetch()
	return result[0]?.date
}

const LocalStoreShape = shape({ myID: string })

type LocalStore = Shaped<typeof LocalStoreShape>

export const fetchLocalStore = async () => {
	const result = await db.table('KeyValue').select().fetch()

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
	const [{ value }] = await db.table('KeyValue').select('value').match({ key }).fetch()
	return value ?? null
}

export const setObjectToLocalStore = <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
	object: V,
) => db.table('KeyValue').insert({ key, object })

export const getObjectFromLocalStore = async <K extends keyof LocalStore, V extends LocalStore[K]>(
	key: K,
) => {
	const [{ object }] = await db.table('KeyValue').select('object').match({ key }).fetch()
	return (object ?? null) as V | null
}

export const removeItemFromLocalStore = async <K extends keyof LocalStore>(key: K) => {
	return db.table('KeyValue').delete().where('key', '=', key).run()
}

export const clearLocalStore = () => db.table('KeyValue').delete().run()
