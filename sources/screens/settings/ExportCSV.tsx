import React, { FC, useCallback, useState } from 'react'

import { Button, View, Text, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { goBack } from 'navigation'
import { store } from 'store'
import { calendarStore } from 'store/CalendarStore'
import { TouchableHighlight } from 'components/primitives'
import { FastText, Spacer } from 'components/Spacer'
import { GRAY, GRAY_LIGHT, GRAY_ULTRALIGHT, ORANGE } from 'const/Colors'
import { Device } from 'const'
import { shareCSV } from 'logic/csv'

export const ExportCSVScreen = createScreen(
	'ExportCSV',
	observer(() => {
		const [selectedMonths, setSelectedMonths] = useState([calendarStore.lastYearMonths[0]])

		const toggleSelection = useCallback(
			(month: string) => {
				setSelectedMonths((selected) => {
					return selected.includes(month)
						? selected.filter((_) => _ !== month)
						: selected.concat(month)
				})
			},
			[setSelectedMonths],
		)

		const done = useCallback(() => {
			setSelectedMonths((selected) => {
				// TODO: call generate CSV function
				shareCSV(selected)
				return selected
			})
		}, [setSelectedMonths])

		return (
			<View style={styles.container}>
				<Spacer flex={1} />
				<Text style={styles.title}>Please choose months to export:</Text>
				<View style={styles.section}>
					<View style={styles.yearContainer}>
						{calendarStore.lastYearMonths.map((month, index) => {
							const selected = selectedMonths.includes(month)
							const today = index === 0
							return <MonthItem {...{ selected, today, toggleSelection, month }} key={month} />
						})}
					</View>
				</View>
				<Spacer flex={1} />
				<View style={styles.section}>
					<View style={styles.buttonContainer}>
						<Button
							title="Done"
							onPress={done}
							disabled={selectedMonths.length === 0}
							color={ORANGE}
						/>
					</View>
				</View>
				<View style={styles.section}>
					<View style={styles.buttonContainer}>
						<Button title="Cancel" onPress={goBack} color={ORANGE} />
					</View>
				</View>
				<Spacer height={Device.safeBottomInset} />
			</View>
		)
	}),
	{ presentation: 'formSheet' },
)

const MonthItem: FC<{
	selected: boolean
	today: boolean
	month: string
	toggleSelection: (month: string) => void
}> = observer(({ selected, today, month, toggleSelection }) => {
	const toggle = useCallback(() => {
		toggleSelection(month)
	}, [toggleSelection, month])

	return (
		<TouchableHighlight onPress={toggle} underlayColor={GRAY_ULTRALIGHT} style={styles.monthItem}>
			<Spacer
				backgroundColor={
					selected
						? today
							? ORANGE
							: store.colorScheme === 'light'
							? GRAY_LIGHT
							: GRAY
						: 'transparent'
				}
				flex={1}
				alignItems="center"
				justifyContent="center"
			>
				<FastText
					color={selected && today ? 'white' : store.theme.text}
					fontWeight={selected ? (today ? 'bold' : 'normal') : '200'}
					fontSize={16}
				>
					{month}
				</FastText>
			</Spacer>
		</TouchableHighlight>
	)
})

const margin = 8

const styles = createStyles({
	container: { margin, flex: 1 },

	section: () => ({
		borderRadius: 16,
		margin,
		backgroundColor: store.theme.background,
		alignItems: 'stretch',
		overflow: 'hidden',
	}),
	title: () => ({
		color: store.theme.text2,
		textAlign: 'center',
		fontSize: 16,
		margin: 16,
	}),
	yearContainer: () => ({
		flexDirection: 'row-reverse',
		flexWrap: 'wrap-reverse',
	}),
	monthItem: () => ({
		borderColor: store.theme.separator2,
		borderWidth: StyleSheet.hairlineWidth,
		height: 44,
		width: (Device.width - margin * 4) / 2 - StyleSheet.hairlineWidth,
	}),
	buttonContainer: {
		height: 57,
		justifyContent: 'center',
	},
})
