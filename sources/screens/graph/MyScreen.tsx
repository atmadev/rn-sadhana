import React from 'react'
import { View, Text, Button } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { GraphList } from './List'
import { graphStore } from 'store/GraphStore'
import { fetchMyRecentEntries } from 'logic/entries'
import { Device } from 'const'
import { signOut } from 'logic'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		return (
			<View style={{ paddingTop: Device.safeTopInset }}>
				<Button title="Sign out" onPress={signOut} />
				<Text style={{ marginLeft: 10 }}>My Graph Screen</Text>
				<GraphList
					entries={graphStore.my!.entriesByDate}
					refreshing={graphStore.my!.refreshing}
					onRefresh={fetchMyRecentEntries}
				/>
			</View>
		)
	}),
)
