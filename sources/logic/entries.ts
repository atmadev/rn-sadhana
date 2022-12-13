import { InteractionManager } from 'react-native'
import { db } from 'services/localDB'
import * as vs from 'services/network/vs'
import { getLast, trimmed } from 'utils'
import { monthStringFromDate, utcStringFromDate } from 'dateUtil'
import { Entry, OtherGraphItem } from 'types'
import { graphStore } from 'store/GraphStore'
import { otherGraphsStore } from 'store/OtherGraphsStore'
import { userStore } from 'store/UserStore'
import { vsRunSafe } from './vs'
import { searchGraphStore } from 'store/SearchGraphStore'

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
		entries.forEach((e) => (e.dateSynced = e.updated_at))
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
	const editedEntries: Entry[] = []
	const graph = graphStore.my!

	graph.mxEntries.forEach((mxEntry, ymd) => {
		if (!mxEntry.isChanged) return

		// if exists, update (merge)
		const existingEntry = graph.entries.get(ymd)
		if (existingEntry) {
			const mergedEntry: Entry = {
				...existingEntry,
				...mxEntry.entryInputFields,
				updated_at: utcStringFromDate(),
			}
			editedEntries.push(mergedEntry)
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
		}
	})

	if (editedEntries.length === 0) return

	graph.setEntries(editedEntries)
	db.insertEntries(editedEntries)

	InteractionManager.runAfterInteractions(graph.clearMXEntries)

	await sendEntries()
}

const fetchOtherEntries = async (date = new Date(), userID?: string) => {
	const graph = userID ? graphStore.graphForUserID(userID) : graphStore.selected!
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
		await fetchOtherEntries(undefined, userID)

		const date = new Date()
		date.setMonth(date.getMonth() - 1)
		await fetchOtherEntries(date, userID)
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
			page_num,
			items_per_page,
		})
		if (result.success) {
			const { entries } = result.data
			entries.forEach(handleGraphItem)
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

export const searchGraph = async () => {
	const searchTime = Date.now()
	try {
		searchGraphStore.setSearchingTime(searchTime)
		const result = await vs.allEntries({
			country: searchGraphStore.country,
			city: searchGraphStore.city,
			search_term: searchGraphStore.searchString,
			items_per_page,
		})
		if (result.success) {
			const { entries } = result.data
			entries.forEach(handleGraphItem)
			searchGraphStore.setItems(entries, searchTime)
		} else {
			// TODO: show error
		}
	} catch (e) {
		// TODO: capture exception
	} finally {
		searchGraphStore.removeSearchingTime(searchTime)
	}
}

export const sendEntries = async () => {
	const userId = userStore.myID
	if (!userId) return
	try {
		const entries = await db.entriesToSync(userId)
		if (entries.length > 0) {
			for await (const entry of entries) {
				if (entry.id) {
					// UPDATE
					const result = await vsRunSafe(() =>
						vs.updateEntry(userId!, {
							...entry,
							entry_id: entry.id!,
							entrydate: entry.date,
						}),
					)

					if (result.success)
						await db.updateEntry(userId, entry.date, { dateSynced: entry.updated_at })
					else {
						// TODO: handle error
					}
				} else {
					// POST
					const result = await vsRunSafe(() =>
						vs.postEntry(userId!, { ...entry, entrydate: entry.date }),
					)
					if (result.success) {
						await db.updateEntry(userId!, entry.date, {
							id: result.data.entry_id,
							dateSynced: entry.updated_at,
						})
					} else {
						// TODO: handle error
					}
				}
			}
		}
	} catch (e) {
		// TODO: handle error
		console.log('logic/entries.sendEntries', e)
	}
}

const handleGraphItem = (item: OtherGraphItem) => {
	userStore.setUser({
		userid: item.user_id,
		user_name: trimmed(item.spiritual_name) ?? trimmed(item.karmic_name),
		user_nicename: item.user_nicename,
		avatar_url: item.avatarUrl,
	})
	const graph = graphStore.graphForUserID(item.user_id)
	graph.setEntries([item])
}
