import React, { useEffect } from 'react'
import { View, Text } from 'components/primitives'

import { observer } from 'mobx-react-lite'
import { goBack } from 'navigation/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { createScreen, createStyles } from 'screens/utils'
import { EntryEditingView } from './EntryEditingView'
import { Spacer } from 'components/Spacer'
import { Device, configureLayoutAnimationFromKeyboardEvent } from 'const'
import { Button, InteractionManager } from 'react-native'
import { keyboardStore } from 'store/KeyboardStore'
import { graphStore } from 'store/GraphStore'
import { saveEditing } from 'logic/entries'
import { YMD } from 'shared/types'
import { ymdStringFromDate } from 'shared/dateUtil'
import { ORANGE } from 'const/Colors'
import { store } from 'store'

export const GraphEditingScreen = createScreen<{ ymd?: YMD }>(
	'GraphEditing',
	observer(({ ymd = ymdStringFromDate() }) => {
		if (Device.ios)
			useEffect(() => {
				const e = keyboardStore.lastKeyboardEvent
				if (e) configureLayoutAnimationFromKeyboardEvent(e)
			}, [keyboardStore.lastKeyboardEvent])

		const entry = graphStore.my!.getMXEntry(ymd)

		return (
			<View style={styles.container}>
				<EntryEditingView ymd={ymd} />
				<View style={styles.bottomBar}>
					<Button title="Back" onPress={entry.goBack} />
					<Button title="Next" onPress={entry.goNext} />
					<Button title="Save" onPress={onSave} />
				</View>
				<Spacer
					height={keyboardStore.isVisible ? keyboardStore.keyboardHeight : Device.safeBottomInset}
				/>
			</View>
		)
	}),
	{
		headerTitle: 'My Graph Editing',
		headerLeft: () => (
			<TouchableOpacity onPress={onCancel}>
				<Text style={styles.cancelText}>Cancel</Text>
			</TouchableOpacity>
		),
		presentation: 'fullScreenModal',
	},
)

const onCancel = () => {
	goBack()
	InteractionManager.runAfterInteractions(graphStore.my!.clearMXEntries)
}

const onSave = () => {
	goBack()
	saveEditing()
}

const styles = createStyles({
	container: () => ({ flex: 1, backgroundColor: store.theme.background }),
	bottomBar: () => ({
		height: 44,
		// borderTopColor: store.theme.separator,
		// borderTopWidth: 1,
		flexDirection: 'row',
	}),
	cancelText: () => ({ color: ORANGE, fontSize: 16 }),
})
