import { makeAutoObservable } from 'mobx'
import { createRef, RefObject } from 'react'
import { TextInput } from 'react-native'
import { EntryInputFields, YMD } from 'types'
import { MXTime } from './MXTime'
import { persistentStore } from './PersistentStore'

// TODO: check will server eat empty string as japa counts

export class MXEntry {
	constructor(ymd: YMD, entry?: EntryInputFields) {
		this.ymd = ymd

		this.japa7 = parseJapaCount(entry?.jcount_730)
		this.japa10 = parseJapaCount(entry?.jcount_1000)
		this.japa18 = parseJapaCount(entry?.jcount_1800)
		this.japa24 = parseJapaCount(entry?.jcount_after)

		this.reading = new MXTime(parseInt(entry?.reading ?? '0'))

		this.wakeUp = new MXTime(entry?.opt_wake_up ?? undefined)

		this.kirtan = entry?.kirtan === '1'
		this.yoga = entry?.opt_exercise === '1'
		this.service = entry?.opt_service === '1'
		this.lections = entry?.opt_lections === '1'

		this.sleep = new MXTime(entry?.opt_sleep ?? undefined)

		let refsCount = 6
		if (persistentStore.wakeUpEnabled) refsCount += 2
		if (persistentStore.bedEnabled) refsCount += 2

		for (let i = 0; i < refsCount; i++) {
			this.refs.push(createRef<TextInput | null>())
		}

		this.initialHash = this.hash

		makeAutoObservable(this, { initialHash: false, ymd: false })
	}

	ymd: string

	japa7: string
	setJapa7 = (j: string) => (this.japa7 = j)

	japa10: string
	setJapa10 = (j: string) => (this.japa10 = j)

	japa18: string
	setJapa18 = (j: string) => (this.japa18 = j)

	japa24: string
	setJapa24 = (j: string) => (this.japa24 = j)

	reading: MXTime

	sleep: MXTime
	wakeUp: MXTime

	kirtan: boolean
	setKirtan = (kirtan: boolean) => (this.kirtan = kirtan)

	service: boolean
	setService = (service: boolean) => (this.service = service)

	yoga: boolean
	setYoga = (yoga: boolean) => (this.yoga = yoga)

	lections: boolean
	setLections = (lections: boolean) => (this.lections = lections)

	refs: RefObject<TextInput | null>[] = []

	private go = (forward: boolean) => {
		let i = 0
		for (const r of this.refs) {
			if (r.current?.isFocused()) {
				const newIndex = i + (forward ? 1 : -1)
				if (newIndex >= 0 && newIndex < this.refs.length) this.refs[newIndex].current?.focus()
				return
			}
			i++
		}
		this.refs[forward ? 0 : this.refs.length - 1].current?.focus()
	}

	goBack = () => this.go(false)
	goNext = () => this.go(true)

	get entryInputFields(): EntryInputFields {
		return {
			jcount_730: this.japa7.length === 0 ? '0' : this.japa7,
			jcount_1000: this.japa10.length === 0 ? '0' : this.japa10,
			jcount_1800: this.japa18.length === 0 ? '0' : this.japa18,
			jcount_after: this.japa24.length === 0 ? '0' : this.japa24,
			reading: this.reading.allInMinutesString,
			opt_sleep: !this.sleep.empty ? this.sleep.string : null,
			opt_wake_up: !this.wakeUp.empty ? this.wakeUp.string : null,
			kirtan: this.kirtan ? '1' : '0',
			opt_exercise: this.yoga ? '1' : '0',
			opt_service: this.service ? '1' : '0',
			opt_lections: this.lections ? '1' : '0',
		}
	}

	initialHash: string

	get hash() {
		return Object.entries(this.entryInputFields)
			.filter(([, value]) => value !== null && value !== undefined && value !== '0' && value !== '')
			.map((entry) => entry.join(':'))
			.join(',')
	}

	get isChanged() {
		return this.hash !== this.initialHash
	}
}

const parseJapaCount = (j?: string | null) => (!j || parseInt(j) === 0 ? '' : j)
