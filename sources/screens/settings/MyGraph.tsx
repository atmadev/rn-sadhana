import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { List } from 'components/List'
import { persistentStore } from 'store/PersistentStore'
import { updateOptions } from 'logic/user'

export const MyGraphSettingsScreen = createScreen(
	'MyGraphSettings',
	observer(() => {
		useEffect(() => {
			return () => {
				updateOptions()
			}
		}, [])

		return (
			<List.Scroll>
				<List.Section title="Fields">
					<List.Switch
						title="Wake Up Time"
						value={persistentStore.wakeUpEnabled}
						onValueChange={persistentStore.setWakeUpEnabled}
					/>
					<List.Switch
						title="Service"
						value={persistentStore.serviceEnabled}
						onValueChange={persistentStore.setServiceEnabled}
					/>
					<List.Switch
						title="Yoga"
						value={persistentStore.yogaEnabled}
						onValueChange={persistentStore.setYogaEnabled}
					/>
					<List.Switch
						title="Lections"
						value={persistentStore.lectionsEnabled}
						onValueChange={persistentStore.setLectionsEnabled}
					/>
					<List.Switch
						title="Bed Time"
						value={persistentStore.bedEnabled}
						onValueChange={persistentStore.setBedEnabled}
					/>
				</List.Section>
				<List.Section>
					<List.Switch
						title="Reading only in minutes"
						value={persistentStore.readingInMinutes}
						onValueChange={persistentStore.setReadingInMinutes}
					/>
					<List.Switch
						title="Keyboard autofocus"
						value={persistentStore.keyboardAutoFocusEnabled}
						onValueChange={persistentStore.setKeyboardAutoFocusEnabled}
					/>
				</List.Section>
				<List.Section>
					<List.Button title="Suggest Setting" onPress={suggestSetting} />
				</List.Section>
			</List.Scroll>
		)
	}),
)

const suggestSetting = () => {}
