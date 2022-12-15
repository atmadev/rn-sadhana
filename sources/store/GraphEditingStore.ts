import { Device } from 'const'
import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Easing,
	FlatList,
	Keyboard,
} from 'react-native'
import { YMD } from 'types'
import { calendarStore } from './CalendarStore'
import { graphStore } from './GraphStore'

class GraphEditingStore {
	constructor() {
		makeAutoObservable(this)
	}

	flatList = createRef<FlatList>()
	scrollX = new Animated.Value(0)
	index = 0
	setIndex = (i: number) => (this.index = i >= 0 ? Math.floor(i) : 0)

	scrollToRight = () => {
		Animated.timing(this.scrollX, {
			toValue: 0,
			useNativeDriver: true,
			easing: Easing.inOut(Easing.ease),
		}).start()

		this.flatList.current?.scrollToIndex({ animated: true, index: 0 })
	}

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
		this.setIndex(calendarStore.lastYearDays.indexOf(ymd))
		this.scrollX.setValue(this.currentOffset)
	}

	onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }], {
		useNativeDriver: true,
	})

	onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const prevIndex = this.index
		this.setIndex(event.nativeEvent.contentOffset.x / Device.width)
		if (prevIndex !== this.index) Keyboard.dismiss()
	}

	clear = () => {
		this.index = 0
		this.scrollX.setValue(0)
	}
}

export const graphEditingStore = new GraphEditingStore()
