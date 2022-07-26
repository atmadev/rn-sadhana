import { Shaped, Shape } from 'shared/types/primitives'
import { store } from 'store'
import { request, RequestMethod } from '.'
// prettier-ignore
import { EntriesRequest, LoginParams, PostEntry, EntryID, RefreshTokenParams, sTokens, User, UpdateEntry, EntriesResponse } from './vsShapes'

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

		return result
	} catch (e) {
		console.log('login error', e)
		throw e
	}
}

export const vsRequest = async <ParamsShape extends Shape, ResponseShape extends Shape>(
	method: RequestMethod,
	path: string,
	body?: {
		shape: { [shapeName: string]: ParamsShape }
		data: Shaped<ParamsShape>
	},
	response?: { [shapeName: string]: ResponseShape },
) => {
	return request(
		method,
		'https://vaishnavaseva.net/vs-api/v2/sadhana/' + path,
		{ body, headers: { Authorization: 'Bearer ' + store.tokens!.access_token } },
		response,
	)
}

export const me = async () => {
	try {
		const result = await vsRequest('GET', 'me', undefined, { User })
		console.log('result', result)
		return result
	} catch (e) {
		console.log('me error', e)
		throw e
	}
}

export const refreshTokens = async () => {
	try {
		const result = await request(
			'POST',
			'https://vaishnavaseva.net?oauth=token',
			{
				body: {
					shape: { RefreshTokenParams },
					data: {
						grant_type: 'refresh_token',
						refresh_token: store.tokens!.refresh_token,
						client_id,
						client_secret,
					},
				},
			},
			{
				sTokens,
			},
		)
		console.log('result', result)
		return result
	} catch (e) {
		console.log('refreshToken error', e)
		throw e
	}
}

export const entries = async (userId: string, data: Shaped<typeof EntriesRequest>) => {
	try {
		const result = await vsRequest(
			'POST',
			'userSadhanaEntries/' + userId,
			{ shape: { EntriesRequest }, data },
			{ EntriesResponse },
		)
		console.log('result', result)
		return result
	} catch (e) {
		console.log('entries error', e)
		throw e
	}
}

export const postEntry = async (userId: string, data: Shaped<typeof PostEntry>) => {
	try {
		const result = await vsRequest(
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
		const result = await vsRequest('PUT', 'sadhanaEntry/' + userId, {
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
		const result = await vsRequest('POST', 'options/' + data.userid, {
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
