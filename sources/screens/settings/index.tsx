import React from 'react'
import { ScrollView, Button, StyleSheet } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { Spacer } from 'components/Spacer'
import { signOut } from 'logic'

export const SettingsScreen = createScreen(
	'Settings',
	observer(() => {
		return (
			<ScrollView style={styles.container}>
				<Spacer
					backgroundColor="white"
					marginVertical={16}
					borderTopColor="gray"
					borderTopWidth={StyleSheet.hairlineWidth}
					borderBottomColor="gray"
					borderBottomWidth={StyleSheet.hairlineWidth}
				>
					<Button title="Sign out" onPress={signOut} />
				</Spacer>
			</ScrollView>
		)
	}),
	{},
)

const styles = createStyles({
	container: {},
})
