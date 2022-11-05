import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { observer } from 'mobx-react-lite'
import { FlashList } from '@shopify/flash-list'
import { View, Text } from 'react-native'
import { calendarStore } from 'store/CalendarStore'
import { EntryItem } from './EntryItem'
import { createStyles } from 'screens/utils'
import { store } from 'store'
import { graphStore } from 'store/GraphStore'

interface Props {
	userID: string
	onRefresh: () => void
}

export const GraphList: FC<Props> = observer(({ userID, onRefresh }) => {
	useLayoutEffect(() => {
		calendarStore.upDateIfNeeded()
	}, [])

	const graph = graphStore.map.get(userID)!
	const { refreshing } = graph

	const { data, headerIndexes, lastItemIndexes } = calendarStore.lastYearDaysWithMonths

	const renderItem = useCallback(
		({ item, index }: { item: string; index: number }) => {
			if (headerIndexes.has(index)) {
				return (
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionHeaderText}>{item}</Text>
					</View>
				)
			}

			return <EntryItem ymd={item} userID={userID} isLast={lastItemIndexes.has(index)} />
		},
		[userID, headerIndexes],
	)

	const stickyHeaderIndices = useMemo(() => Array.from(headerIndexes), [headerIndexes])

	return (
		<FlashList
			data={data}
			refreshing={refreshing}
			onRefresh={onRefresh}
			renderItem={renderItem}
			getItemType={getItemType}
			stickyHeaderIndices={stickyHeaderIndices}
			estimatedItemSize={50}
			scrollIndicatorInsets={scrollIndicatorInsets}
		/>
	)
})

const getItemType = (_: any, index: number) => {
	const { headerIndexes } = calendarStore.lastYearDaysWithMonths
	return headerIndexes.has(index) ? 'header' : 'entry'
}

const headerHeight = 28
const scrollIndicatorInsets = { top: headerHeight }

const styles = createStyles({
	sectionHeader: () => ({
		backgroundColor: store.theme.background,
		height: headerHeight,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: store.theme.separator,
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 6,
	}),
	sectionHeaderText: () => ({ color: store.theme.text2 }),
})
