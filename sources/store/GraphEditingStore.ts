import { Device } from 'const'
import { makeAutoObservable } from 'mobx'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { YMD } from 'shared/types'
import { calendarStore } from './CalendarStore'
import { graphStore } from './GraphStore'

class GraphEditingStore {
	constructor() {
		makeAutoObservable(this)
	}

	scrollX = new Animated.Value(0)
	index = 0
	setIndex = (i: number) => (this.index = i)

	get currentYMD() {
		return calendarStore.lastYearDays[this.index]
	}

	get currentEntry() {
		return graphStore.my!.getMXEntry(this.currentYMD)
	}

	get currentOffset() {
		return this.index * Device.width
	}

	get flatListContentOffset() {
		return {
			x: this.currentOffset,
			y: 0,
		}
	}

	selectYMD = (ymd: YMD) => {
		this.index = calendarStore.lastYearDays.indexOf(ymd)
		this.scrollX.setValue(this.currentOffset)
	}

	onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }], {
		useNativeDriver: true,
	})

	onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.index = event.nativeEvent.contentOffset.x / Device.width
	}
}

export const graphEditingStore = new GraphEditingStore()
