import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { observer } from 'mobx-react-lite'
import { FlashList } from '@shopify/flash-list'
import { View, Text } from 'react-native'
import { calendarStore } from 'store/CalendarStore'
import { EntryItem } from './EntryItem'
import { createStyles } from 'screens/utils'
import { store } from 'store'
import { graphStore } from 'store/GraphStore'
import { monthStringFromDate } from 'shared/dateUtil'
import { fetchOtherEntriesPreviousMonth } from 'logic/entries'
import { userStore } from 'store/UserStore'

interface Props {
	userID: string
	onRefresh: () => void
	header?: FC
	trimmed?: true // for month by month loading, when you trim not loaded months
}

export const GraphList: FC<Props> = observer(({ userID, onRefresh, header, trimmed }) => {
	useLayoutEffect(() => {
		calendarStore.upDateIfNeeded()
	}, [])

	const graph = graphStore.map.get(userID)!
	const { refreshing, lastLoadedMonth, entries } = graph

	const { data, headerIndexes, lastItemIndexes } = calendarStore.lastYearDaysWithMonths

	const renderItem = useCallback(
		({ item, index }: { item: string; index: number }) =>
			headerIndexes.has(index) ? (
				<SectionHeader title={item} />
			) : (
				<EntryItem ymd={item} userID={userID} isLast={lastItemIndexes.has(index)} />
			),
		[userID, headerIndexes],
	)

	const stickyHeaderIndices = useMemo(() => Array.from(headerIndexes), [headerIndexes])

	const memoData = useMemo(() => {
		if (trimmed) {
			const date = graph.lastLoadedMonth ? new Date(graph.lastLoadedMonth) : new Date()
			date.setMonth(date.getMonth() - 1)
			const previousMonth = monthStringFromDate(date)

			const foundIndex = data.findIndex((_) => _ === previousMonth)

			if (foundIndex !== -1) return data.slice(0, foundIndex)
			else console.log(`ERROR! can't find month ${previousMonth}`)
		}

		return data
	}, [trimmed, data, lastLoadedMonth, entries.size])

	return (
		<FlashList
			ListHeaderComponent={header}
			data={memoData}
			refreshing={refreshing}
			onRefresh={onRefresh}
			renderItem={renderItem}
			getItemType={getItemType}
			stickyHeaderIndices={stickyHeaderIndices}
			estimatedItemSize={51}
			scrollIndicatorInsets={scrollIndicatorInsets}
			onEndReached={trimmed ? fetchOtherEntriesPreviousMonth : undefined}
			onEndReachedThreshold={1}
			ListFooterComponent={Footer}
		/>
	)
})

const SectionHeader: FC<{ title: string }> = observer(({ title }) => (
	<View style={styles.sectionHeader}>
		<Text style={styles.sectionHeaderText}>{title}</Text>
	</View>
))

const Footer: FC = observer(() => {
	const graph = graphStore.selected

	if (!graph || graph.userID === userStore.myID) return null

	return graph.loadingPreviousMonth ? (
		<ActivityIndicator style={styles.bottomActivityIndicator} />
	) : null
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
	bottomActivityIndicator: { marginTop: 50, marginBottom: 70 },
})
