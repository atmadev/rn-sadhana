import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { GraphList } from './List'
import { myGraphStore } from 'store/MyGraphStore'

export const MyGraphScreen = createScreen(
	'MyGraph',
	observer(() => {
		useEffect(() => {
			console.log('entries by date', myGraphStore.entriesByDate)
		}, [])

		return (
			<View>
				<Text>My Graph Screen</Text>
				<GraphList entries={myGraphStore.entriesByDate} />
			</View>
		)
	}),
)
