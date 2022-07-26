import { sTokens } from 'services/network/vsShapes'
import { Profile, ProfileConfig } from 'shared/types'
import { PersistentShaped, Shaped, ShapeName } from 'shared/types/primitives'
import { shape } from 'shared/types/shapeTool'
import { setupDB, SQLDB } from './sqlite'
import { SQLSchema } from './sqlite/types'

const useShapes = <SN extends ShapeName>(...names: SN[]) => names

const usedShapeNames = useShapes('Entry', 'Profile', 'ProfileConfig', 'KeyValue')

type UsedShapeNames = typeof usedShapeNames[number]

const schema: SQLSchema<UsedShapeNames> = {
	Profile: {},
	ProfileConfig: {},
	Entry: {
		unique: [['uid', 'd DESC']],
		index: [['uid', 'dateSynced']],
	},
	KeyValue: {},
}

let db: SQLDB<UsedShapeNames>

type Entry = PersistentShaped<'Entry'>

export const initLocalDB = async () => (db = await setupDB(schema))

export const insertProfiles = (profiles: Profile[]) => db.table('Profile').insert(...profiles)
export const importProfileConfigs = async (configs: ProfileConfig[]) => {
	const mappedConfigs = (await db.table('Profile').select('uid').fetch()).map((value, index) => {
		const config = configs[index]
		config.uid = value.uid
		return config
	})

	return db.table('ProfileConfig').insert(...mappedConfigs)
}

// prettier-ignore
export const searchProfile = (searchString: string) =>
	db.table('Profile')
		.select('uid', 'firstName', 'lastName', 'spiritualName')
		.search(searchString, 'firstName', 'lastName', 'spiritualName', 'bio')
		.orderBy('spiritualName NULLS LAST', 'firstName', 'lastName')
		.fetch(30)

export const insertEntries = (entries: Entry[]) => db.table('Entry').insert(...entries)
export const importEntries = async (entries: Entry[]) => {
	const mappedEntries = (await db.table('Profile').select('uid').fetch()).flatMap(
		(value, index) => {
			const tenEntries = entries.slice(index * 10, index * 10 + 9)
			tenEntries.forEach((e) => (e.uid = value.uid))
			return tenEntries
		},
	)

	return db.table('Entry').insert(...mappedEntries)
}

export const updateEntry = (uid: string, d: number, entry: Partial<Omit<Entry, 'uid' | 'd'>>) =>
	db.table('Entry').update(entry).match({ uid, d }).run()

/*
export const entries = (uid: string, month: string) =>
	db.table('Entry').select().match({ uid }).where('d', '>', ).orderBy('d DESC').fetch()
*/
// prettier-ignore
export const entriesToSync = (uid: string) =>
	db.table('Entry')
		.select()
		.match({ uid })
		.where('dateSynced', 'IS', 'NULL')
		.or('dateSynced', '<', 'du', true)
		.fetch()

const LocalStoreShape = shape({
	tokens: sTokens,
})

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

export const clearLocalStore = () => db.table('KeyValue').delete().run()
