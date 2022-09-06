import * as db from 'services/localDB'
import * as vs from 'services/network/vs'
import { utcStringFromDate } from 'shared/dateUtil'
import { FALSE, TRUE } from 'shared/types/primitives'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'

export const fetchMyRecentEntries = async () => {
	try {
		const myID = userStore.myID!
		let modified_since = await db.entryUpdatedDateForUser(userStore.myID!)

		if (!modified_since) {
			const date = new Date()
			// date.setUTCFullYear(date.getUTCFullYear() - 1)
			date.setUTCMonth(date.getUTCMonth() - 6)
			modified_since = utcStringFromDate(date)
		}

		const entriesResult = await vs.entries(myID, { modified_since })
		if (!entriesResult.success) return false

		const { entries } = entriesResult.data
		graphStore.setEntries(entries, myID)
		await db.insertEntries(entries)

		const maxUpdatedDate = entries.reduce((a, b) => (a > b.updated_at ? a : b.updated_at), '')
		if (maxUpdatedDate !== '') await db.setEntryUpdatedDateForUser(myID, maxUpdatedDate)

		return TRUE
	} catch (e) {
		console.log('fetchMyRecentEntries', e)
		return FALSE
	}
}
