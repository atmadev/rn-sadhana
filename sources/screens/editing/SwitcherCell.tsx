import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { store } from 'store'
import { Switch } from 'components/List/Switch'

export const SwitcherCell: FC<{
	title: string
	value: boolean
	onValueChange: (value: boolean) => void
}> = observer((props) => {
	return (
		<View style={styles.container}>
			<Switch {...props} />
		</View>
	)
})

const styles = createStyles({
	container: () => ({
		borderBottomColor: store.theme.separator,
		borderBottomWidth: StyleSheet.hairlineWidth,
	}),
})
