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
	setValue: (value: boolean) => void
}> = observer(({ title, value, setValue }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<Spacer flex={1} />
			<RNSwitch value={value} onValueChange={setValue} />
		</View>
	)
})

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
