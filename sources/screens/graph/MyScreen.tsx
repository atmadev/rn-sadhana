import React from 'react'
import { View, Image } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { GraphList } from './List'
import { graphStore } from 'store/GraphStore'
import { fetchMyRecentEntries } from 'logic/entries'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SettingsScreen } from 'screens/settings'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		return (
			<View>
				<GraphList
					entries={graphStore.my!.entriesByYMD}
					refreshing={graphStore.my!.refreshing}
					onRefresh={fetchMyRecentEntries}
				/>
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
