import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { SectionList, View, Text } from 'react-native'

import { observer } from 'mobx-react-lite'
import { Entry } from 'shared/types'
import { calendarStore } from 'store/CalendarStore'
import { utcDateStringFromDate } from 'shared/dateUtil'

interface Props {
	entries: { [date: string]: Entry }
}

export const GraphList: FC<Props> = observer(({ entries }) => {
	useLayoutEffect(() => {
		calendarStore.upDateIfNeeded()
	}, [])

	const renderItem = useCallback(({ item }: { item: Date }) => {
		const entry = entries[utcDateStringFromDate(item)]
		return (
			<View>
				<Text>
					{item.getDate()}: {entry ? (entry.jcount_730 ?? '0') + (entry.jcount_1000 ?? '0') : '-'}
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
			sections={sections}
			renderSectionHeader={renderSectionHeader}
			getItemLayout={getItemLayout}
			keyExtractor={keyExtractor}
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
