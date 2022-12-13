import { makeAutoObservable } from 'mobx'
import { pad } from 'utils'

export class MXTime {
	constructor(time?: string | number) {
		if (typeof time === 'string') {
			const [hours, minutes] = time.split(':') ?? ['', '']
			this.hours = hours ?? ''
			this.minutes = minutes ?? ''
		} else if (typeof time === 'number') {
			this.hours = time > 0 ? Math.floor(time / 60).toString() : ''
			this.minutes = time > 0 ? (time % 60).toString() : ''
		} else if (time === undefined) {
			this.hours = ''
			this.minutes = ''
		} else
			throw new Error(`Can't initialize time with not string | number | undefined value ${time}`)

		makeAutoObservable(this)
	}

	hours: string
	get hoursNumber() {
		return this.hours.length === 0 ? 0 : parseInt(this.hours)
	}

	setHours = (hours: string) => {
		if (hours !== '') {
			const number = parseInt(hours)
			if (number < 0 || number > 23) {
				return
			}
		}

		this.hours = hours
	}

	minutes: string
	get minutesNumber() {
		return this.minutes.length === 0 ? 0 : parseInt(this.minutes)
	}

	setMinutes = (minutes: string) => {
		if (minutes !== '') {
			const number = parseInt(minutes)
			if (number < 0 || number > 59) return
		}
		this.minutes = minutes
	}

	setAllInMinutes = (allMinutes: string) => {
		if (allMinutes === '') {
			this.hours = ''
			this.minutes = ''
			return
		}

		const number = parseInt(allMinutes)
		const minutes = number % 60
		const hours = Math.floor(number / 60)

		if (hours < 24) {
			this.minutes = minutes.toString()
			this.hours = hours > 0 ? hours.toString() : ''
		}
	}

	get string() {
		return pad(this.hoursNumber, 2) + ':' + pad(this.minutesNumber, 2)
	}

	get allInMinutesString() {
		return this.hours === '' && this.minutes === ''
			? ''
			: (this.hoursNumber * 60 + this.minutesNumber).toString()
	}

	get empty() {
		return this.hours === '' || this.minutes === ''
	}
}
