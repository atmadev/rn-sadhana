import React from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { GraphList } from './List'
import { myGraphStore } from 'store/MyGraphStore'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		return (
			<View style={{ paddingTop: 44 }}>
				<Text style={{ marginLeft: 10 }}>My Graph Screen</Text>
				<GraphList entries={myGraphStore.entriesByDate} />
			</View>
		)
	}),
)
