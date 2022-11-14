import React from 'react'
import { Alert } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { signOut } from 'logic'
import { List } from 'components/List'
import { ORANGE, RED } from 'const/Colors'
import { navigate } from 'navigation'
import * as MailComposer from 'expo-mail-composer'
import * as Clipboard from 'expo-clipboard'
import { userStore } from 'store/UserStore'
import { userName } from 'utils'

export const SettingsScreen = createScreen(
	'Settings',
	observer(() => {
		return (
			<List.Scroll>
				<List.Section>
					<List.Row imageUrl={userStore.me!.avatar_url} title={userName(userStore.me!)} arrow />
				</List.Section>
				<List.Section>
					<List.Row title="My Graph" arrow onPress={openMyGraphSetting} />
					<List.Button title="Export CSV" onPress={exportCSV} />
				</List.Section>
				<List.Section>
					<List.Button title="Feedback" color={ORANGE} onPress={onFeedback} />
				</List.Section>
				<List.Section>
					<List.Button title="Sign out" color={RED} onPress={signOut} />
				</List.Section>
			</List.Scroll>
		)
	}),
)

const openMyGraphSetting = () => navigate('MyGraphSettings')
const exportCSV = () => {}

const feedbackEmail = 'feedback.sadhana@gmail.com'
const onFeedback = async () => {
	const isAvailable = await MailComposer.isAvailableAsync()
	if (isAvailable) MailComposer.composeAsync({ recipients: [feedbackEmail] })
	else {
		Clipboard.setStringAsync(feedbackEmail)
		Alert.alert(
			'Your mail app is not configured',
			'Our email is copied to your clipboard already. We will wait for your letter',
		)
	}
}
