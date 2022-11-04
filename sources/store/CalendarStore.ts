import { makeAutoObservable } from 'mobx'
import { isTheSameDay, ymdStringFromDate } from 'shared/dateUtil'
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

	get lastYearMonths() {
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

	get lastYearDays() {
		return this.lastYearMonths.flatMap((m) => m)
	}
}

export const calendarStore = new CalendarStore()
