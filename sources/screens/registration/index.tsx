import React from 'react'
import { List } from 'components/List'
import { observer } from 'mobx-react-lite'
import { createScreen } from 'screens/utils'
import { registrationStore } from 'store/RegistrationStore'
import { register } from 'logic/auth'
import { Button } from 'react-native'
import { goBack } from 'navigation'
import { ORANGE } from 'const/Colors'
import { StatusBar } from 'expo-status-bar'

export const RegistrationScreen = createScreen(
	'Registration',
	observer(() => {
		return (
			<List.Scroll keyboardDismissMode="interactive">
				<StatusBar style="dark" animated />
				<List.Section>
					<List.Input
						title="Spiritual name"
						value={registrationStore.spiritualName}
						onChangeText={registrationStore.setSpiritualName}
					/>
					<List.Input
						title="First name"
						value={registrationStore.firstName}
						onChangeText={registrationStore.setFirstName}
						textContentType="name"
					/>
					<List.Input
						title="Last name"
						value={registrationStore.lastName}
						onChangeText={registrationStore.setLastName}
						textContentType="familyName"
					/>
					<List.Input
						title="Email"
						value={registrationStore.email}
						onChangeText={registrationStore.setEmail}
						keyboardType="email-address"
						textContentType="emailAddress"
					/>
				</List.Section>

				<List.Section subTitle="Password should have at least 8 characters">
					<List.Input
						title="Password"
						value={registrationStore.password}
						onChangeText={registrationStore.setPassword}
						secureTextEntry
						keyboardType="ascii-capable"
						textContentType="password"
					/>
					<List.Input
						title="Confirm password"
						value={registrationStore.confirmPassword}
						onChangeText={registrationStore.setConfirmPassword}
						secureTextEntry
						keyboardType="ascii-capable"
						textContentType="password"
					/>
				</List.Section>

				<List.Section>
					<List.Button
						title="Register"
						onPress={register}
						disabled={!registrationStore.buttonEnabled}
						loading={registrationStore.loading}
					/>
				</List.Section>
			</List.Scroll>
		)
	}),
	{
		presentation: 'fullScreenModal',
		headerShown: true,
		headerLeft() {
			return <Button title="Cancel" onPress={goBack} color={ORANGE} />
		},
	},
)
