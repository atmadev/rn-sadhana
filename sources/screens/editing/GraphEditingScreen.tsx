import React, { useEffect } from 'react'
// prettier-ignore
import { View, Text, InteractionManager, ListRenderItemInfo, Animated, StyleSheet, Image } from 'react-native'

import { Observer, observer } from 'mobx-react-lite'
import { goBack } from 'navigation'
import { TouchableOpacity } from 'components/primitives'
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
import { YMD } from 'types'
import { Spacer } from 'components/Spacer'
import { graphEditingStore } from 'store/GraphEditingStore'
import { arrowLeft, arrowRight, checkButton } from 'assets/index'
import { capitalize } from 'lodash'
import { formatLocal } from 'utils'
import { globalStyles } from 'globalStyles'
import { persistentStore } from 'store/PersistentStore'

export const GraphEditingScreen = createScreen(
	'GraphEditing',
	observer(() => {
		if (Device.ios)
			useEffect(() => {
				const t = keyboardStore.lastKeyboardEventTime
				if (keyboardStore.lastKeyboardEvent && Date.now() - t < 1000)
					configureLayoutAnimationFromKeyboardEvent(keyboardStore.lastKeyboardEvent)
			}, [keyboardStore.lastKeyboardEventTime])

		useEffect(() => {
			const entry = graphEditingStore.currentEntry
			if (!persistentStore.keyboardAutoFocusEnabled || !entry) return

			entry.goNext()
		}, [])

		return (
			<View style={styles.container}>
				<DateList />
				<Animated.FlatList
					ref={graphEditingStore.flatList}
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
					<Spacer flex={1} flexDirection="row">
						<TouchableOpacity
							style={styles.arrowButton}
							onPress={graphEditingStore.currentEntry.goBack}
						>
							<Image source={arrowLeft} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.arrowButton}
							onPress={graphEditingStore.currentEntry.goNext}
						>
							<Image source={arrowRight} />
						</TouchableOpacity>
					</Spacer>
					<TouchableOpacity onPress={onSave}>
						<Image source={checkButton} />
					</TouchableOpacity>
					<Spacer flex={1} />
				</View>
				<Spacer
					height={keyboardStore.isVisible ? keyboardStore.keyboardHeight : Device.safeBottomInset}
				/>
			</View>
		)
	}),
	{
		headerTitle: () => (
			<Observer>
				{() => {
					return (
						<Text style={styles.headerTitle}>
							{capitalize(formatLocal(graphEditingStore.currentYMD, 'LLLL yyyy'))}
						</Text>
					)
				}}
			</Observer>
		),
		headerLeft: () => (
			<TouchableOpacity onPress={onCancel} style={globalStyles.barButton}>
				<Text style={styles.cancelText}>Cancel</Text>
			</TouchableOpacity>
		),
		headerRight: () => (
			<TouchableOpacity onPress={onToday} style={globalStyles.barButton}>
				<Text style={styles.cancelText}>Today</Text>
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
	graphEditingStore.clear()
	InteractionManager.runAfterInteractions(graphStore.my!.clearMXEntries)
}

const onToday = () => {
	graphEditingStore.scrollToRight()
}

const onSave = () => {
	goBack()
	saveEditing()
	graphEditingStore.clear()
}

const styles = createStyles({
	container: () => ({ flex: 1, backgroundColor: store.theme.background }),
	bottomBar: () => ({
		height: 50,
		borderTopColor: store.theme.separator,
		borderTopWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	}),
	cancelText: () => ({ color: ORANGE, fontSize: 16 }),
	arrowButton: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: () => ({
		color: store.theme.text,
	}),
})
