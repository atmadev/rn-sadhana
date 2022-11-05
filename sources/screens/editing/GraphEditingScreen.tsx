import React, { useEffect } from 'react'
import {
	View,
	Text,
	InteractionManager,
	ListRenderItemInfo,
	Animated,
	Button,
	StyleSheet,
} from 'react-native'

import { observer } from 'mobx-react-lite'
import { goBack } from 'navigation'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createScreen, createStyles } from 'screens/utils'
import { EntryEditingView } from './EntryEditingView'
import { Device, configureLayoutAnimationFromKeyboardEvent } from 'const'

import { keyboardStore } from 'store/KeyboardStore'
import { graphStore } from 'store/GraphStore'
import { saveEditing } from 'logic/entries'
import { ORANGE } from 'const/Colors'
import { store } from 'store'
import { calendarStore } from 'store/CalendarStore'
import { DateList } from './DateList'
import { YMD } from 'shared/types'
import { Spacer } from 'components/Spacer'
import { graphEditingStore } from 'store/GraphEditingStore'

export const GraphEditingScreen = createScreen(
	'GraphEditing',
	observer(() => {
		if (Device.ios)
			useEffect(() => {
				const e = keyboardStore.lastKeyboardEvent
				if (e) configureLayoutAnimationFromKeyboardEvent(e)
			}, [keyboardStore.lastKeyboardEvent])

		return (
			<View style={styles.container}>
				<DateList />
				<Animated.FlatList
					contentOffset={graphEditingStore.flatListContentOffset}
					data={calendarStore.lastYearDays}
					renderItem={renderItem}
					getItemLayout={getItemLayout}
					onScroll={graphEditingStore.onScroll}
					onMomentumScrollEnd={graphEditingStore.onScrollEnd}
					showsHorizontalScrollIndicator={false}
					scrollEventThrottle={16}
					maxToRenderPerBatch={3}
					initialNumToRender={3}
					windowSize={4}
					pagingEnabled
					horizontal
					inverted
				/>

				<View style={styles.bottomBar}>
					<Button title="Back" onPress={graphEditingStore.currentEntry.goBack} />
					<Button title="Next" onPress={graphEditingStore.currentEntry.goNext} />
					<Button title="Save" onPress={onSave} />
				</View>
				<Spacer
					height={keyboardStore.isVisible ? keyboardStore.keyboardHeight : Device.safeBottomInset}
				/>
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
	return <EntryEditingView ymd={item} key={item} />
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

const onSave = () => {
	goBack()
	saveEditing()
}

const styles = createStyles({
	container: () => ({ flex: 1, backgroundColor: store.theme.background }),
	bottomBar: () => ({
		height: 44,
		borderTopColor: store.theme.separator,
		borderTopWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
	}),
	cancelText: () => ({ color: ORANGE, fontSize: 16 }),
})
