import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	InteractionManager,
	ListRenderItemInfo,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Animated,
} from 'react-native'
import { View, Text } from 'components/primitives'

import { observer } from 'mobx-react-lite'
import { goBack } from 'navigation'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createScreen, createStyles } from 'screens/utils'
import { EntryEditingView } from './EntryEditingView'
import { Device, configureLayoutAnimationFromKeyboardEvent } from 'const'

import { keyboardStore } from 'store/KeyboardStore'
import { graphStore } from 'store/GraphStore'
// import { saveEditing } from 'logic/entries'
import { ymdStringFromDate } from 'shared/dateUtil'
import { ORANGE } from 'const/Colors'
import { store } from 'store'
import { calendarStore } from 'store/CalendarStore'
import { DateList } from './DateList'
import { YMD } from 'shared/types'

export const GraphEditingScreen = createScreen(
	'GraphEditing',
	observer(({ ymd = ymdStringFromDate() }) => {
		if (Device.ios)
			useEffect(() => {
				const e = keyboardStore.lastKeyboardEvent
				if (e) configureLayoutAnimationFromKeyboardEvent(e)
			}, [keyboardStore.lastKeyboardEvent])

		// const graph = graphStore.my!
		// const entry = graph.getMXEntry(ymd)
		const initialIndex = calendarStore.lastYearDays.indexOf(ymd)
		const initialOffset = initialIndex * Device.width

		const x = useMemo(() => new Animated.Value(initialOffset), [initialOffset])

		const onScroll = useMemo(
			() =>
				Animated.event([{ nativeEvent: { contentOffset: { x } } }], {
					useNativeDriver: true,
				}),
			[x],
		)

		const [currentIndex, setCurrentIndex] = useState(initialIndex)

		const onScrollEnd = useCallback(
			(event: NativeSyntheticEvent<NativeScrollEvent>) => {
				setCurrentIndex(event.nativeEvent.contentOffset.x / Device.width)
			},
			[setCurrentIndex],
		)

		return (
			<View style={styles.container}>
				<DateList scrollX={x} currentIndex={currentIndex} />
				<Animated.FlatList
					contentOffset={{ x: currentIndex * Device.width, y: 0 }}
					data={calendarStore.lastYearDays}
					renderItem={renderItem}
					getItemLayout={getItemLayout}
					onScroll={onScroll}
					onMomentumScrollEnd={onScrollEnd}
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					maxToRenderPerBatch={3}
					initialNumToRender={3}
					windowSize={4}
					pagingEnabled
					horizontal
					inverted
				/>

				{/* <View style={styles.bottomBar}>
					<Button title="Back" onPress={entry.goBack} />
					<Button title="Next" onPress={entry.goNext} />
					<Button title="Save" onPress={onSave} />
				</View> */}
				{/* <Spacer
					height={keyboardStore.isVisible ? keyboardStore.keyboardHeight : Device.safeBottomInset}
				/> */}
			</View>
		)
	}),
	{
		headerTitle: 'My Graph Editing',
		headerLeft: () => (
			<TouchableOpacity onPress={onCancel}>
				<Text style={styles.cancelText}>Cancel</Text>
			</TouchableOpacity>
		),
		presentation: 'fullScreenModal',
	},
)

const renderItem = ({ item }: ListRenderItemInfo<YMD>) => {
	return <EntryEditingView ymd={item} />
}

const getItemLayout = (_: any, index: number) => ({
	length: Device.width,
	offset: Device.width * index,
	index,
})

const onCancel = () => {
	goBack()
	InteractionManager.runAfterInteractions(graphStore.my!.clearMXEntries)
}

// const onSave = () => {
// 	goBack()
// 	saveEditing()
// }

const styles = createStyles({
	container: () => ({ flex: 1, backgroundColor: store.theme.background }),
	bottomBar: () => ({
		height: 44,
		// borderTopColor: store.theme.separator,
		// borderTopWidth: 1,
		flexDirection: 'row',
	}),
	cancelText: () => ({ color: ORANGE, fontSize: 16 }),
})
