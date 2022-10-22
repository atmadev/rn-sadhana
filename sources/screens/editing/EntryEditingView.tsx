import React, { FC } from 'react'
import { TextStyle } from 'react-native'
import { View, TextInput, Text } from 'components/primitives'

import { observer } from 'mobx-react-lite'
import { MXEntry, Time } from 'store/MXEntry'
import { createStyles } from 'screens/utils'

export const EntryEditingView: FC<{ entry: MXEntry }> = observer(({ entry }) => {
	return (
		<View style={styles.container}>
			<TimeInput title="sleep" time={entry.sleep} />
		</View>
	)
})

const TimeInput: FC<{ title: string; time: Time }> = observer(({ title, time }) => {
	return (
		<View>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.row}>
				<SubtitledTextInput
					subtitle="hours"
					value={time.hoursString}
					setValue={time.setHoursString}
				/>
				<SubtitledTextInput
					subtitle="minutes"
					value={time.minutesString}
					setValue={time.setMinutesString}
				/>
			</View>
		</View>
	)
})

const SubtitledTextInput: FC<{
	subtitle: string
	value: string
	setValue: (value: string) => void
}> = observer(({ subtitle, value, setValue }) => {
	return (
		<View>
			<TextInput value={value} onChangeText={setValue} />
			<Text>{subtitle}</Text>
		</View>
	)
})

const styles = createStyles({
	container: {},
	title: (): TextStyle => ({
		fontSize: 20,
	}),
	row: {
		flexDirection: 'row',
	},
})
