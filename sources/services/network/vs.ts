import { OtherGraphItem } from 'types'
import { Shaped, Shape } from 'types/primitives'
import { User, Profile } from 'types/shapes'
import { request, RequestMethod, VSResponse } from '.'
// prettier-ignore
import { MonthEntriesRequest, LoginParams, PostEntry, EntryID, sTokens, UpdateEntry, EntriesResponse, EntriesRequest, Tokens, Registration, UserID } from './vsShapes'

let tokens: Tokens | null = null

export const login = async (username: string, password: string) => {
	try {
		const result = await request(
			'POST',
			'https://vaishnavaseva.net?oauth=token',
			{
				body: {
					shape: { LoginParams },
					data: { username, password, grant_type: 'password', client_id, client_secret },
				},
			},
			{ Tokens: sTokens },
		)
		// console.log({ result })

		if (result.success) tokens = result.data

		return result
	} catch (e) {
		console.log('login error', e)
		throw e
	}
}

const apiPath = 'https://vaishnavaseva.net/vs-api/v2/sadhana/'

const vsShapedRequest = async <ParamsShape extends Shape, ResponseShape extends Shape>(
	method: RequestMethod,
	path: string,
	body?: {
		shape: { [shapeName: string]: ParamsShape }
		data: Shaped<ParamsShape>
		authorize?: boolean
	},
	response?: { [shapeName: string]: ResponseShape },
) => {
	const authorize = body?.authorize === undefined ? true : body.authorize

	if (authorize && !tokens) throw new Error('Trying to make VS request without tokens!')

	return request(
		method,
		'https://vaishnavaseva.net/vs-api/v2/sadhana/' + path,
		{ body, headers: authorize ? { Authorization: 'Bearer ' + tokens!.access_token } : undefined },
		response,
	)
}

const vsRequest = async (method: RequestMethod, path: string, body?: any) => {
	// @ts-ignore
	return request(method, apiPath + path, { body: { data: body } })
}

export const me = async () => {
	try {
		const result = await vsShapedRequest('GET', 'me', undefined, { User })
		// console.log('result', result)
		return result
	} catch (e) {
		console.log('me error', e)
		throw e
	}
}

export const profile = async (id: string) => {
	try {
		const result = await vsShapedRequest('GET', 'userProfile/' + id, undefined, { Profile })
		// console.log('result', result)
		return result
	} catch (e) {
		console.log('load userProfile error', e)
		throw e
	}
}

export const updateProfile = async (data: Shaped<typeof Profile>) => {
	try {
		const result = await vsShapedRequest('POST', 'userProfile/' + data.userid, {
			shape: { Profile },
			data,
		})
		return result
	} catch (e) {
		console.log('load userProfile error', e)
		throw e
	}
}

export const entries = async (
	userId: string,
	data: Shaped<typeof EntriesRequest>,
): Promise<VSResponse<Shaped<typeof EntriesResponse>>> => {
	try {
		const result = await vsShapedRequest(
			'POST',
			'userSadhanaEntries/' + userId,
			{ shape: { EntriesRequest }, data },
			{ EntriesResponse },
		)
		// console.log('entries result', result)
		return result
	} catch (e) {
		console.log('entries error', e)
		throw e
	}
}

export const monthEntries = async (userId: string, data?: Shaped<typeof MonthEntriesRequest>) => {
	try {
		const result = await vsShapedRequest(
			'POST',
			'userSadhanaEntries/' + userId,
			data ? { shape: { MonthEntriesRequest: MonthEntriesRequest }, data } : undefined,
			{ EntriesResponse },
		)
		// console.log('result', result)
		return result
	} catch (e) {
		console.log('monthEntries error', e)
		throw e
	}
}

export const postEntry = async (
	userId: string,
	data: Shaped<typeof PostEntry>,
): Promise<VSResponse<Shaped<typeof EntryID>>> => {
	try {
		const result = await vsShapedRequest(
			'POST',
			'sadhanaEntry/' + userId,
			{ shape: { PostEntry }, data },
			{ EntryID },
		)
		console.log('vs.postEntry result', result)
		return result
	} catch (e) {
		console.log('postEntry error', e)
		throw e
	}
}

export const updateEntry = async (
	userId: string,
	data: Shaped<typeof UpdateEntry>,
): Promise<VSResponse<void>> => {
	try {
		const result = await vsShapedRequest('PUT', 'sadhanaEntry/' + userId, {
			shape: { UpdateEntry },
			data,
		})
		// console.log('result', result)

		// @ts-ignore
		return result
	} catch (e) {
		console.log('postEntry error', e)
		throw e
	}
}

export const updateOptions = async (data: Shaped<typeof User>) => {
	try {
		const result = await vsShapedRequest('POST', 'options/' + data.userid, {
			shape: { User },
			data,
		})
		// console.log('result', result)
		return result
	} catch (e) {
		console.log('updateUser error', e)
		throw e
	}
}

export const allEntries = async (body: {
	country?: string
	city?: string
	search_term?: string
	page_num?: number
	items_per_page?: number
}) => {
	return vsRequest('POST', 'allSadhanaEntries', body) as Promise<
		| {
				success: true
				data: {
					entries: OtherGraphItem[]
					total: number
					page: number
					pageSize: number
				}
		  }
		| { success: false; error: { name: string; message: string } }
	>
}

export const register = async (data: Shaped<typeof Registration>) =>
	vsShapedRequest(
		'POST',
		'registration',
		{ shape: { Registration }, data, authorize: false },
		{ UserID },
	)

const client_id = 'IXndKqmEoXPTwu46f7nmTcoJ2CfIS6'
const client_secret = '1A4oOPOatd8j6EOaL3i9pblOUnqa6j'
