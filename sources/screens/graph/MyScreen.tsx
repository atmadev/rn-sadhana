import React from 'react'
import { Image } from 'react-native'
import { observer } from 'mobx-react-lite'

import { View } from 'react-native'
import { createScreen, createStyles } from 'screens/utils'
import { GraphList } from './List'
import { fetchMyRecentEntries } from 'logic/entries'
import { TouchableOpacity } from 'components/primitives'
import { store } from 'store'
import { navigate } from 'navigation'
import { userStore } from 'store/UserStore'
import { globalStyles } from 'globalStyles'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		return (
			<View style={styles.container}>
				<GraphList userID={userStore.myID!} onRefresh={fetchMyRecentEntries} />
			</View>
		)
	}),
	{
		headerRight: () => (
			<TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
				<Image source={require('assets/images/settings.png')} />
			</TouchableOpacity>
		),
	},
)

export const openSettings = () => navigate('Settings')

const styles = createStyles({
	container: () => ({
		backgroundColor: store.theme.background2,
		flex: 1,
	}),
	settingsButton: {
		...globalStyles.barButton,
		marginRight: -10,
	},
})
