import React, { FC } from 'react'
import { Switch as RNSwitch } from 'react-native'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { Spacer } from 'components/Spacer'
import { store } from 'store'

export const Switch: FC<{
	title: string
	value: boolean
	onValueChange: (value: boolean) => void
}> = observer(({ title, value, onValueChange }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<Spacer flex={1} />
			<RNSwitch {...{ value, onValueChange, trackColor }} />
		</View>
	)
})

const trackColor = { true: '#FF9206' }

const styles = createStyles({
	container: () => ({
		flexDirection: 'row',
		height: 44,
		paddingHorizontal: 16,
		alignItems: 'center',
	}),
	title: () => ({
		fontSize: 15,
		color: store.theme.text,
	}),
})
