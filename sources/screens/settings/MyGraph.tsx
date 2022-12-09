import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { List } from 'components/List'
import { settingsStore } from 'store/SettingsStore'
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
						value={settingsStore.wakeUpEnabled}
						setValue={settingsStore.setWakeUpEnabled}
					/>
					<List.Switch
						title="Service"
						value={settingsStore.serviceEnabled}
						setValue={settingsStore.setServiceEnabled}
					/>
					<List.Switch
						title="Yoga"
						value={settingsStore.yogaEnabled}
						setValue={settingsStore.setYogaEnabled}
					/>
					<List.Switch
						title="Lections"
						value={settingsStore.lectionsEnabled}
						setValue={settingsStore.setLectionsEnabled}
					/>
					<List.Switch
						title="Bed Time"
						value={settingsStore.bedEnabled}
						setValue={settingsStore.setBedEnabled}
					/>
				</List.Section>
				<List.Section>
					<List.Switch
						title="Reading only in minutes"
						value={settingsStore.readingInMinutes}
						setValue={settingsStore.setReadingInMinutes}
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
