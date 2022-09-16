import { Expand, FALSE, Shape, Shaped, TRUE } from 'shared/types/primitives'
import { validateObjectWithShape } from 'shared/types/utils'

export const request = async <ParamsShape extends Shape, ResponseShape extends Shape>(
	method: RequestMethod,
	url: string,
	request?: {
		headers?: { [key: string]: string }
		body?: {
			shape: { [shapeName: string]: ParamsShape }
			data: Shaped<ParamsShape>
		}
	},
	response?: { [shapeName: string]: ResponseShape },
): Promise<Expand<VSResponse<Shaped<ResponseShape>>>> => {
	console.log('request', method, url, request?.body?.data)
	let body

	if (request?.body) {
		const [bodyShapeName, bodyShape] = Object.entries(request.body.shape)[0]
		validateObjectWithShape(request.body.data, bodyShape, bodyShapeName, 'Invalid Request Body')
		body = JSON.stringify(request.body.data)
	}

	const result = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			...request?.headers,
		},
		body,
	})

	console.log('result', result.ok, result.status, result.statusText, result.type)
	const data = await result.json()
	console.log('response', method, url, data)

	if (result.ok) {
		// TODO: validate response code

		if (response) {
			const [responseShapeName, responseShape] = Object.entries(response)[0]
			validateObjectWithShape(data, responseShape, responseShapeName)
		}
		return { success: TRUE, data }
	} else {
		return {
			success: FALSE,
			error: {
				name: data.error,
				message: data.error_description,
			},
		}
	}
}

export type VSResponse<T> =
	| { success: true; data: Expand<T> }
	| {
			success: false
			error: {
				name: ErrorName
				message: string
			}
	  }

type ErrorName =
	| 'json_not_logged_in'
	| 'rest_forbidden'
	| 'unsupported_grant_type'
	| 'invalid_grant'
	| 'sadhana_entry_exists'
	| 'entry_not_found'
	| 'user_not_found'

export type RequestMethod = 'GET' | 'POST' | 'PUT'
