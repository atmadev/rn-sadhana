import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { SectionList, View, Text } from 'react-native'

import { observer } from 'mobx-react-lite'
import { Entry } from 'shared/types'
import { calendarStore } from 'store/CalendarStore'
import { ymdStringFromDate } from 'shared/dateUtil'

interface Props {
	entries: { [date: string]: Entry }
	refreshing: boolean
	onRefresh: () => void
}

export const GraphList: FC<Props> = observer(({ entries, refreshing, onRefresh }) => {
	useLayoutEffect(() => {
		calendarStore.upDateIfNeeded()
	}, [])

	const renderItem = useCallback(({ item }: { item: Date }) => {
		const entry = entries[ymdStringFromDate(item)]
		return (
			<View style={{ padding: 5 }}>
				<Text>
					{item.getDate() + ':\t'}
					{entry
						? (entry.jcount_730 ?? '0') +
						  '\t' +
						  (entry.jcount_1000 ?? '0') +
						  '\t' +
						  (entry.jcount_1800 ?? '0') +
						  '\t' +
						  (entry.jcount_after ?? '0')
						: '-'}
				</Text>
			</View>
		)
	}, [])

	const sections = useMemo(() => {
		return calendarStore.lastYearMonths.map((data) => {
			return {
				data,
				renderItem,
			}
		})
	}, [calendarStore.lastYearMonths, entries])

	return (
		<SectionList
			refreshing={refreshing}
			onRefresh={onRefresh}
			sections={sections}
			renderSectionHeader={renderSectionHeader}
			getItemLayout={getItemLayout}
			keyExtractor={keyExtractor}
			style={{ padding: 10 }}
		/>
	)
})

const renderSectionHeader = ({ section: { data } }: { section: { data: Date[] } }) => {
	const d = data[0]
	return <Text>{d.toDateString()}</Text>
}

const getItemLayout = (_: any, index: number) => ({
	length: ITEM_HEIGHT,
	offset: ITEM_HEIGHT * index,
	index,
})

const keyExtractor = (item: Date) => item.toISOString()

const ITEM_HEIGHT = 44

export interface Month {
	date: string
	data: Entry[]
}
