import { makeAutoObservable } from 'mobx'
import { EntryInputFields } from 'shared/types'
import { pad } from 'shared/utils'

export class MXEntry {
	japa7: string
	setJapa7 = (j: string) => (this.japa7 = j)

	japa10: string
	setJapa10 = (j: string) => (this.japa10 = j)

	japa18: string
	setJapa18 = (j: string) => (this.japa18 = j)

	japa24: string
	setJapa24 = (j: string) => (this.japa24 = j)

	reading: number
	kirtan: boolean

	sleep: Time
	wakeUp: Time

	yoga: boolean
	service: boolean
	lections: boolean

	constructor(entry?: EntryInputFields) {
		makeAutoObservable(this)

		this.japa7 = entry?.jcount_730 ?? '0'
		this.japa10 = entry?.jcount_1000 ?? '0'
		this.japa18 = entry?.jcount_1800 ?? '0'
		this.japa24 = entry?.jcount_after ?? '0'

		this.reading = parseInt(entry?.reading ?? '0')
		this.kirtan = !!entry?.kirtan

		this.sleep = new Time(entry?.opt_sleep ?? undefined)
		this.wakeUp = new Time(entry?.opt_wake_up ?? undefined)

		this.yoga = !!entry?.opt_exercise
		this.service = !!entry?.opt_service
		this.lections = !!entry?.opt_lections
	}

	get entryInputFields(): EntryInputFields {
		return {
			jcount_730: this.japa7,
			jcount_1000: this.japa10,
			jcount_1800: this.japa18,
			jcount_after: this.japa24,
			reading: this.reading.toString(),
			kirtan: this.kirtan ? '1' : '0',
			opt_sleep: this.sleep ? this.sleep.string : null,
			opt_wake_up: this.wakeUp ? this.wakeUp.string : null,
			opt_exercise: this.yoga ? '1' : '0',
			opt_service: this.service ? '1' : '0',
			opt_lections: this.lections ? '1' : '0',
		}
	}
}

export class Time {
	hours: number
	get hoursString() {
		return this.hoursChanged ? this.hours.toString() : ''
	}

	setHoursString = (hs: string) => {
		const h = parseInt(hs)
		if (h >= 0 && h < 24) {
			this.hours = h
			this.hoursChanged = true
		}
	}

	hoursChanged = false

	minutes: number
	get minutesString() {
		return this.minutesChanged ? this.minutes.toString() : ''
	}

	setMinutesString = (ms: string) => {
		const m = parseInt(ms)
		if (m >= 0 && m < 60) {
			this.minutes = m
			this.minutesChanged = true
		}
	}

	minutesChanged = false
	get changed() {
		return this.hoursChanged || this.minutesChanged
	}

	constructor(string?: string) {
		const [hoursString, minutesString] = string?.split(':') ?? ['0', '0']
		this.hours = parseInt(hoursString)
		this.minutes = parseInt(minutesString)
	}

	get string() {
		return pad(this.hours, 2) + ':' + pad(this.minutes, 2)
	}
}
