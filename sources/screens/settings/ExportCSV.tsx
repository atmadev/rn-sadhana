import React, { FC, useCallback, useState } from 'react'

import { Button, View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { goBack } from 'navigation'
import { store } from 'store'
import { calendarStore } from 'store/CalendarStore'
import { TouchableHighlight } from 'components/primitives'
import { FastText, Spacer } from 'components/Spacer'
import { GRAY, GRAY_SYSTEM, GRAY_ULTRALIGHT, ORANGE } from 'const/Colors'
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
				<View style={styles.yearContainer}>
					{calendarStore.lastYearMonths.map((month, index) => {
						const selected = selectedMonths.includes(month)
						const today = index === 0
						return <MonthItem {...{ selected, today, toggleSelection, month }} key={month} />
					})}
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
							? GRAY_SYSTEM
							: GRAY
						: 'transparent'
				}
				flex={1}
				alignItems="center"
				justifyContent="center"
			>
				<FastText
					color={selected ? 'white' : today ? ORANGE : store.theme.text}
					fontWeight={selected ? 'bold' : today ? 'normal' : '200'}
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
	container: { flex: 1 },

	section: () => ({
		borderRadius: 16,
		margin,
		marginHorizontal: margin * 2,
		backgroundColor: store.theme.background,
		alignItems: 'stretch',
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
		justifyContent: 'center',
	}),
	monthItem: () => ({
		borderRadius: 16,
		backgroundColor: store.theme.background,
		margin,
		height: 44,
		width: (Device.width - margin * 8) / 3,
		overflow: 'hidden',
	}),
	buttonContainer: {
		height: 57,
		justifyContent: 'center',
	},
})
