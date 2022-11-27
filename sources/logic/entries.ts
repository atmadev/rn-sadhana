import { InteractionManager } from 'react-native'
import * as db from 'services/localDB'
import * as vs from 'services/network/vs'
import { PostEntry, UpdateEntry } from 'services/network/vsShapes'
import { getLast } from 'services/utils'
import { monthStringFromDate, utcStringFromDate } from 'shared/dateUtil'
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
	const localEntries = await db.fetchEntries(userStore.myID!)
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

const fetchOtherEntries = async (date = new Date()) => {
	const graph = graphStore.selected!
	const result = await vs.monthEntries(graph.userID, {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
	})

	if (result.success) {
		const { entries } = result.data
		graph.setEntries(entries)
		graph.setLastLoadedMonth(monthStringFromDate(date))
	} else {
		// TODO: handle error
	}
}

export const refreshOtherEntries = async (userID?: string) => {
	const graph = userID ? graphStore.graphForUserID(userID) : graphStore.selected
	if (!graph || graph.refreshing) return
	graph.setRefreshing(true)
	graph.setLoadingPreviousMonth(true)

	try {
		await fetchOtherEntries()

		const date = new Date()
		date.setMonth(date.getMonth() - 1)
		await fetchOtherEntries(date)
	} catch (e) {
		// TODO: hande error (show alert, send to the sentry)
	} finally {
		graph.setRefreshing(false)
		graph.setLoadingPreviousMonth(false)
	}
}

export const fetchOtherEntriesPreviousMonth = async () => {
	const graph = graphStore.selected
	if (!graph || graph.loadingPreviousMonth || !graph.lastLoadedMonth) return
	graph.setLoadingPreviousMonth(true)

	try {
		const date = new Date(graph.lastLoadedMonth)
		date.setMonth(date.getMonth() - 1)
		await fetchOtherEntries(date)
	} catch (e) {
		// TODO: hande error (show alert, send to the sentry)
	} finally {
		graph.setLoadingPreviousMonth(false)
	}
}

const items_per_page = 25

export const fetchOtherGraphs = async (reset?: true) => {
	if (otherGraphsStore.loadingPage !== null) return
	const page_num = reset ? 0 : otherGraphsStore.pageNumber + 1
	try {
		otherGraphsStore.setLoadingPage(page_num)
		const result = await vs.allEntries({
			country: otherGraphsStore.country,
			city: otherGraphsStore.city,
			page_num,
			items_per_page,
		})
		if (result.success) {
			const { entries } = result.data
			otherGraphsStore.addItems(entries, reset)
			otherGraphsStore.setPageNumber(page_num)
		} else {
			// TODO: show error
		}
	} catch (e) {
		// TODO: capture exception
	} finally {
		otherGraphsStore.setLoadingPage(null)
	}
}

export const searchOtherGraphs = async () => {
	if (otherGraphsStore.loadingPage !== null) return
	try {
		otherGraphsStore.setLoadingPage(0)
		const result = await vs.allEntries({
			country: otherGraphsStore.country,
			city: otherGraphsStore.city,
			search_term: otherGraphsStore.searchString,
			items_per_page,
		})
		if (result.success) {
			const { entries } = result.data
			otherGraphsStore.addSearchItems(entries)
		} else {
			// TODO: show error
		}
	} catch (e) {
		// TODO: capture exception
	} finally {
		otherGraphsStore.setLoadingPage(null)
	}
}
