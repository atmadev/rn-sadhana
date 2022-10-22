import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { SectionList, StyleSheet } from 'react-native'

import { observer } from 'mobx-react-lite'
import { View, Text } from 'components/primitives'
import { Entry } from 'shared/types'
import { calendarStore } from 'store/CalendarStore'
import { ymdStringFromDate } from 'shared/dateUtil'
import { EntryItem } from './EntryItem'
import { createStyles } from 'screens/utils'
import { Spacer } from 'components/Spacer'

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
		return <EntryItem date={item} entry={entry} />
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
			SectionSeparatorComponent={Separator}
		/>
	)
})

const renderSectionHeader = ({ section: { data } }: { section: { data: Date[] } }) => {
	const d = data[0]
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionHeaderText}>{d.toDateString()}</Text>
		</View>
	)
}

const getItemLayout = (_: any, index: number) => ({
	length: ITEM_HEIGHT,
	offset: ITEM_HEIGHT * index,
	index,
})

const keyExtractor = (item: Date) => item.toISOString()

const Separator: FC = () => <Spacer height={10} />

const ITEM_HEIGHT = 44

export interface Month {
	date: string
	data: Entry[]
}

const styles = createStyles({
	sectionHeader: {
		backgroundColor: 'white',
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: '#bbb',
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	sectionHeaderText: {},
})
