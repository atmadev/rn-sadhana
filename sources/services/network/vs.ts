import { Shaped, Shape } from 'shared/types/primitives'
import { User } from 'shared/types/shapes'
import { request, RequestMethod, VSResponse } from '.'
// prettier-ignore
import { MonthEntriesRequest, LoginParams, PostEntry, EntryID, sTokens, UpdateEntry, EntriesResponse, EntriesRequest, Tokens } from './vsShapes'

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
		console.log({ result })

		if (result.success) tokens = result.data

		return result
	} catch (e) {
		console.log('login error', e)
		throw e
	}
}

export const vsAuthorizedRequest = async <ParamsShape extends Shape, ResponseShape extends Shape>(
	method: RequestMethod,
	path: string,
	body?: {
		shape: { [shapeName: string]: ParamsShape }
		data: Shaped<ParamsShape>
	},
	response?: { [shapeName: string]: ResponseShape },
) => {
	if (!tokens) throw new Error('Trying to make VS request without tokens!')

	return request(
		method,
		'https://vaishnavaseva.net/vs-api/v2/sadhana/' + path,
		{ body, headers: { Authorization: 'Bearer ' + tokens!.access_token } },
		response,
	)
}

export const me = async () => {
	try {
		const result = await vsAuthorizedRequest('GET', 'me', undefined, { User })
		console.log('result', result)
		return result
	} catch (e) {
		console.log('me error', e)
		throw e
	}
}

export const entries = async (
	userId: string,
	data: Shaped<typeof EntriesRequest>,
): Promise<VSResponse<Shaped<typeof EntriesResponse>>> => {
	try {
		const result = await vsAuthorizedRequest(
			'POST',
			'userSadhanaEntries/' + userId,
			{ shape: { EntriesRequest: EntriesRequest }, data },
			{ EntriesResponse },
		)
		console.log('entries result', result)
		return result
	} catch (e) {
		console.log('entries error', e)
		throw e
	}
}

export const monthEntries = async (userId: string, data: Shaped<typeof MonthEntriesRequest>) => {
	try {
		const result = await vsAuthorizedRequest(
			'POST',
			'userSadhanaEntries/' + userId,
			{ shape: { MonthEntriesRequest: MonthEntriesRequest }, data },
			{ EntriesResponse },
		)
		console.log('result', result)
		return result
	} catch (e) {
		console.log('monthEntries error', e)
		throw e
	}
}

export const postEntry = async (userId: string, data: Shaped<typeof PostEntry>) => {
	try {
		const result = await vsAuthorizedRequest(
			'POST',
			'sadhanaEntry/' + userId,
			{ shape: { PostEntry }, data },
			{ EntryID },
		)
		console.log('result', result)
		return result
	} catch (e) {
		console.log('postEntry error', e)
		throw e
	}
}

export const updateEntry = async (userId: string, data: Shaped<typeof UpdateEntry>) => {
	try {
		const result = await vsAuthorizedRequest('PUT', 'sadhanaEntry/' + userId, {
			shape: { UpdateEntry },
			data,
		})
		console.log('result', result)
		return result
	} catch (e) {
		console.log('postEntry error', e)
		throw e
	}
}

export const updateOptions = async (data: Shaped<typeof User>) => {
	try {
		const result = await vsAuthorizedRequest('POST', 'options/' + data.userid, {
			shape: { User },
			data,
		})
		console.log('result', result)
		return result
	} catch (e) {
		console.log('updateUser error', e)
		throw e
	}
}

const client_id = 'IXndKqmEoXPTwu46f7nmTcoJ2CfIS6'
const client_secret = '1A4oOPOatd8j6EOaL3i9pblOUnqa6j'
