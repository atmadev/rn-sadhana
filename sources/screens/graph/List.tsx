import React, { FC, useCallback, useLayoutEffect, useMemo } from 'react'
import { SectionList, StyleSheet } from 'react-native'

import { observer } from 'mobx-react-lite'
import { View, Text } from 'components/primitives'
import { Entry, YMD } from 'shared/types'
import { calendarStore } from 'store/CalendarStore'
import { EntryItem } from './EntryItem'
import { createStyles } from 'screens/utils'
import { Spacer } from 'components/Spacer'
import { MXGraph } from 'store/MXGraph'
import { userStore } from 'store/UserStore'
import { store } from 'store'

interface Props {
	graph: MXGraph
	onRefresh: () => void
}

export const GraphList: FC<Props> = observer(({ graph, onRefresh }) => {
	useLayoutEffect(() => {
		calendarStore.upDateIfNeeded()
	}, [])

	const { entries, refreshing } = graph

	const renderItem = useCallback(({ item }: { item: YMD }) => {
		return <EntryItem ymd={item} userId={userStore.myID!} />
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

const renderSectionHeader = ({ section: { data } }: { section: { data: YMD[] } }) => {
	const ymd = data[0]
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionHeaderText}>{ymd}</Text>
		</View>
	)
}

const getItemLayout = (_: any, index: number) => ({
	length: ITEM_HEIGHT,
	offset: ITEM_HEIGHT * index,
	index,
})

const keyExtractor = (ymd: YMD) => ymd

const Separator: FC = () => <Spacer height={10} />

const ITEM_HEIGHT = 44

export interface Month {
	date: string
	data: Entry[]
}

const styles = createStyles({
	sectionHeader: () => ({
		backgroundColor: store.theme.background,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: store.theme.separator,
		borderBottomWidth: StyleSheet.hairlineWidth,
	}),
	sectionHeaderText: () => ({ color: store.theme.text2 }),
})
