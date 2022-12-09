import React, { useCallback } from 'react'
import { List } from 'components/List'
import { createScreen } from 'screens/utils'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { profileStore } from 'store/ProfileStore'
import { useFocusEffect } from '@react-navigation/native'
import { updateProfile } from 'services/network/vs'
import { openURL } from 'expo-linking'

export const MyProfileSettingsScreen = createScreen(
	'MyProfileSettings',
	observer(() => {
		const profile = profileStore.me

		const localStore = useLocalObservable(() => ({
			spiritual_name: profile?.spiritual_name ?? '',
			setSpiritName: (_: string) => (localStore.spiritual_name = _),

			first_name: profile?.first_name ?? '',
			setFirstName: (_: string) => (localStore.first_name = _),

			last_name: profile?.last_name ?? '',
			setLastName: (_: string) => (localStore.last_name = _),
		}))

		const callback = useCallback(
			() => () => {
				if (!profile) return

				updateProfile({
					userid: profile.userid,
					spiritual_name: localStore.spiritual_name,
					first_name: localStore.first_name,
					last_name: localStore.last_name,
				})
			},
			[localStore],
		)

		useFocusEffect(callback)

		return profile ? (
			<List.Scroll>
				<List.Section>
					<List.Input
						title="Spiritual name"
						value={localStore.spiritual_name}
						onChangeText={localStore.setSpiritName}
					/>
					<List.Input
						title="First name"
						value={localStore.first_name}
						onChangeText={localStore.setFirstName}
						textContentType="name"
					/>
					<List.Input
						title="Last name"
						value={localStore.last_name}
						onChangeText={localStore.setLastName}
						textContentType="familyName"
					/>
				</List.Section>

				<List.Section title="To upload avatar image, please visit our site">
					<List.Button title="vaishnavaseva.net" onPress={openSite}></List.Button>
				</List.Section>

				<List.Section>
					<List.Row title="Login" value={profile.login ?? ''} />
					<List.Row title="Email" value={profile.email ?? ''} />
					{/* TOOD: format date */}
					<List.Row title="Registration date" value={profile.registration_date ?? ''} />
				</List.Section>
			</List.Scroll>
		) : null
	}),
)

const openSite = () => openURL('http://vaishnavaseva.net')
