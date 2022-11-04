import { InteractionManager } from 'react-native'
import * as db from 'services/localDB'
import * as vs from 'services/network/vs'
import { PostEntry, UpdateEntry } from 'services/network/vsShapes'
import { getLast } from 'services/utils'
import { utcStringFromDate } from 'shared/dateUtil'
import { Entry } from 'shared/types'
import { Shaped } from 'shared/types/primitives'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'
import { vsRunSafe } from './vs'

export const fetchMyRecentEntries = async () => {
	try {
		graphStore.my!.setRefreshing(true)
		const myID = userStore.myID!
		let modified_since = await db.entryUpdatedDateForUser(userStore.myID!)

		if (!modified_since) {
			const date = new Date()
			date.setUTCFullYear(date.getUTCFullYear() - 1)
			modified_since = utcStringFromDate(date)
		}
		const entriesResult = await vsRunSafe(() => vs.entries(myID, { modified_since }))
		if (!entriesResult.success) return false

		const { entries } = entriesResult.data
		graphStore.setEntries(entries, myID)
		await db.insertEntries(entries)

		const maxUpdatedDate = entries.reduce((a, b) => (a > b.updated_at ? a : b.updated_at), '')
		if (maxUpdatedDate !== '') await db.setEntryUpdatedDateForUser(myID, maxUpdatedDate)

		return true
	} catch (e) {
		// TODO: capture exception on sentry
		console.log('fetchMyRecentEntries', e)
		return false
	} finally {
		graphStore.my!.setRefreshing(false)
	}
}

export const fetchLocalEntries = async () => {
	const localEntries = await db.entries(userStore.myID!)
	graphStore.setEntries(localEntries, userStore.myID!)
}

export const saveEditing = async () => {
	const dataToPost: Shaped<typeof PostEntry>[] = []
	const dataToUpdate: Shaped<typeof UpdateEntry>[] = []

	const editedEntries: Entry[] = []
	const graph = graphStore.my!

	graph.mxEntries.forEach((mxEntry, ymd) => {
		// if exists, update (merge)
		const existingEntry = graph.entries.get(ymd)
		if (existingEntry && existingEntry.id) {
			const mergedEntry = {
				...existingEntry,
				...mxEntry.entryInputFields,
			}
			editedEntries.push(mergedEntry)
			if (mergedEntry.id) {
				dataToUpdate.push({
					...mxEntry.entryInputFields,
					entry_id: existingEntry.id!,
					entrydate: existingEntry.date,
				})
			}
		} else {
			// post entry
			const localEntry: Entry = {
				...(existingEntry ?? {
					created_at: utcStringFromDate(),
					updated_at: utcStringFromDate(),
					user_id: userStore.myID!,
					date: ymd,
					day: getLast(ymd.split('-'))!,
				}),
				...mxEntry.entryInputFields,
			}

			editedEntries.push(localEntry)
			dataToPost.push({
				...mxEntry.entryInputFields,
				entrydate: ymd,
			})
		}
	})

	graph.setEntries(editedEntries)

	InteractionManager.runAfterInteractions(graph.clearMXEntries)

	// TODO: Upload at VS
}
