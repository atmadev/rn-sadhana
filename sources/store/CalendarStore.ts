import { makeAutoObservable } from 'mobx'
import { isTheSameDay, monthStringFromDate, ymdStringFromDate } from 'shared/dateUtil'
import { YMD } from 'shared/types'

class CalendarStore {
	constructor() {
		makeAutoObservable(this)
	}

	currentDate = new Date()
	upDateIfNeeded() {
		if (isTheSameDay(this.currentDate, new Date())) return

		this.currentDate = new Date()
	}

	get lastYearMonthsWithDays() {
		const months = [] as YMD[][]

		for (let index = 0; index < 12; index++) {
			const dates = [] as YMD[]
			// enumerate dates of this month
			let date = new Date(this.currentDate)
			date.setMonth(this.currentDate.getMonth() - index)
			const month = date.getMonth()

			if (index !== 0) {
				// Go to end of the month
				date.setDate(1)
				date.setMonth(date.getMonth() + 1)
				date.setDate(-1)
			}

			do {
				dates.push(ymdStringFromDate(date))
				date = new Date(date)
				date.setDate(date.getDate() - 1)
			} while (date.getMonth() === month)

			months.push(dates)
		}

		return months
	}

	get lastYearMonths() {
		const months = [] as string[]

		for (let index = 0; index < 12; index++) {
			const date = new Date(this.currentDate)
			date.setMonth(this.currentDate.getMonth() - index)

			months.push(monthStringFromDate(date))
		}

		return months
	}

	get lastYearDays() {
		return this.lastYearMonthsWithDays.flatMap((m) => m)
	}

	get lastYearDaysWithMonthsInPlace() {
		const headerIndexes = new Set<number>()
		const lastItemIndexes = new Set<number>()
		let lastIndex = 0
		const data = this.lastYearMonthsWithDays.flatMap((month) => {
			const headerIndex = lastIndex
			headerIndexes.add(headerIndex)
			lastItemIndexes.add(headerIndex + month.length)

			lastIndex += month.length + 1

			return [month[0].slice(0, 7), ...month]
		})
		return { data, headerIndexes, lastItemIndexes }
	}
}

export const calendarStore = new CalendarStore()
