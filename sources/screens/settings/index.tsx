import React from 'react'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { signOut } from 'logic'
import { List } from 'components/List'
import { RED } from 'const/Colors'
import { navigate } from 'navigation'

export const SettingsScreen = createScreen(
	'Settings',
	observer(() => {
		return (
			<List.Scroll>
				<List.Section title="Title">
					<List.Row title="My Graph" arrow onPress={openMyGraphSetting} />
					<List.Button title="Export CSV" onPress={exportCSV} />
				</List.Section>
				<List.Section>
					<List.Button title="Sign out" color={RED} onPress={signOut} />
				</List.Section>
			</List.Scroll>
		)
	}),
	{},
)

const openMyGraphSetting = () => navigate('MyGraphSettings')
const exportCSV = () => {}
