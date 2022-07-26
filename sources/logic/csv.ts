import { graphStore } from 'store/GraphStore'
import { persistentStore } from 'store/PersistentStore'
import { userStore } from 'store/UserStore'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { capitalize } from 'lodash'
import { formatLocal } from 'utils'

export const shareCSV = async (months: string[]) => {
	if (!userStore.me) return
	// enumerate months
	let csv = ''
	months
		.sort((a, b) => a.localeCompare(b))
		.reverse()
		.forEach((month) => {
			// | month
			// | create string
			csv += capitalize(formatLocal(month, 'LLLL yyyy'))
			const { wakeUpEnabled, serviceEnabled, yogaEnabled, lectionsEnabled, bedEnabled } =
				persistentStore

			// | add header (based on ther user options)
			if (wakeUpEnabled) csv += ',☀️'
			csv += ',🎹,📖'
			if (serviceEnabled) csv += ',🦶'
			if (yogaEnabled) csv += ',🧘‍♂️'
			if (lectionsEnabled) csv += ',🎧'
			if (bedEnabled) csv += ',🌙'
			csv += ',7:30,10:00,18:00,00:00'

			// | fetch entries
			const entries = graphStore.my!.entriesByMonth[month]
			// | enumerate entries
			entries.forEach((entry) => {
				csv += '\n' + entry.day
				if (wakeUpEnabled) csv += ',' + (entry.opt_wake_up ?? '')
				csv += ',' + (entry.kirtan === '1' ? '✓' : '') + ',' + (entry.reading ?? '')
				if (serviceEnabled) csv += ',' + (entry.opt_service === '1' ? '✓' : '')
				if (yogaEnabled) csv += ',' + (entry.opt_service === '1' ? '✓' : '')
				if (lectionsEnabled) csv += ',' + (entry.opt_lections === '1' ? '✓' : '')
				if (bedEnabled) csv += ',' + (entry.opt_sleep ?? '')

				csv +=
					formatRounds(entry.jcount_730) +
					formatRounds(entry.jcount_1000) +
					formatRounds(entry.jcount_1800) +
					formatRounds(entry.jcount_after)
			})
			csv += '\n'
		})

	// share csvs
	// TODO: think about pretty name
	const fileUri = FileSystem.cacheDirectory + 'csv.csv'
	await FileSystem.writeAsStringAsync(fileUri, csv)
	await Sharing.shareAsync(fileUri)
}

const formatRounds = (rounds?: string | null) => ',' + (rounds === '0' || !rounds ? '' : rounds)
