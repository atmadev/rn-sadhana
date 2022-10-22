import React from 'react'
import { View, Text } from 'components/primitives'

import { observer } from 'mobx-react-lite'
import { goBack } from 'navigation/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createScreen } from 'screens/utils'

export const GraphEditingScreen = createScreen(
	'GraphEditing',
	observer(() => {
		return <View></View>
	}),
	{
		headerTitle: 'My Graph Editing',
		headerLeft: () => (
			<TouchableOpacity onPress={goBack}>
				<Text>Cancel</Text>
			</TouchableOpacity>
		),
	},
)
