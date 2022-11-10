import { InteractionManager } from 'react-native'
import * as db from 'services/localDB'
import * as vs from 'services/network/vs'
import { PostEntry, UpdateEntry } from 'services/network/vsShapes'
import { getLast } from 'services/utils'
import { utcStringFromDate } from 'shared/dateUtil'
import { Entry } from 'shared/types'
import { Shaped } from 'shared/types/primitives'
import { graphStore } from 'store/GraphStore'
import { otherGraphsStore } from 'store/OtherGraphsStore'
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
		if (!mxEntry.isChanged) return

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

	if (editedEntries.length === 0) return

	graph.setEntries(editedEntries)
	db.insertEntries(editedEntries)

	InteractionManager.runAfterInteractions(graph.clearMXEntries)

	try {
		for await (const entry of dataToPost) {
			const result = await vsRunSafe(() => vs.postEntry(userStore.myID!, entry))
			console.log('Posting entry result', result)
		}
	} catch (e) {
		// TODO: capture on sentry
		console.log('Posting entry exception', e)
	}

	try {
		for await (const entry of dataToUpdate) {
			const result = await vsRunSafe(() => vs.updateEntry(userStore.myID!, entry))
			console.log('Updating entry result', result)
		}
	} catch (e) {
		// TODO: capture on sentry
		console.log('Updating entry exception', e)
	}
}

export const fetchOtherGraphs = async () => {
	try {
		const result = await vs.allEntries({
			country: otherGraphsStore.country,
			city: otherGraphsStore.city,
			search_term: otherGraphsStore.searchString,
			page_num: otherGraphsStore.pageNumber,
			items_per_page: 5,
		})
		if (result.success) {
			const { entries, page } = result.data
			otherGraphsStore.addItems(entries)
			otherGraphsStore.setPageNumber(page)
		} else {
			// TODO: show error
		}
	} catch (e) {
		// TODO: capture exception
	}
}
