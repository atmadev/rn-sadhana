import React from 'react'
import { Image } from 'react-native'
import { observer } from 'mobx-react-lite'

import { View } from 'components/primitives'
import { createScreen, createStyles } from 'screens/utils'
import { GraphList } from './List'
import { graphStore } from 'store/GraphStore'
import { fetchMyRecentEntries } from 'logic/entries'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SettingsScreen } from 'screens/settings'
import { store } from 'store'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		return (
			<View style={styles.container}>
				<GraphList graph={graphStore.my!} onRefresh={fetchMyRecentEntries} />
			</View>
		)
	}),
	{
		headerRight: () => (
			<TouchableOpacity onPress={openSettings}>
				<Image source={require('assets/images/settings.png')} />
			</TouchableOpacity>
		),
	},
)

export const openSettings = () => SettingsScreen.navigate()

const styles = createStyles({
	container: () => ({
		backgroundColor: store.theme.background2,
	}),
})
