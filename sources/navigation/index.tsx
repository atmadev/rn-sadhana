/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { Pressable, Text } from 'react-native'

import { ModalExample } from 'screens/ModalExample'
import { TabTwo } from 'screens/TabTwoScreen'
import { BlankComponent, setNavigation } from './utils'
import { store } from 'store'
import { observer } from 'mobx-react-lite'
import { LoginScreen } from 'screens/LoginScreen'
import { MyGraphScreen } from 'screens/graph/MyScreen'

export const Navigation = observer(() => {
	return (
		<NavigationContainer
			ref={setNavigation}
			theme={store.colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				<RootStack.Screen name="MainStack" component={MainStackContainer} />
				<RootStack.Screen
					name="Root"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
				/>
				<RootStack.Group screenOptions={{ presentation: 'modal' }}>
					<RootStack.Screen {...ModalExample.Screen} />
				</RootStack.Group>
			</RootStack.Navigator>
		</NavigationContainer>
	)
})

// TODO: change blank component to the splash
export const MainStackContainer = () => (
	<MainStack.Navigator screenOptions={{ headerShown: false }}>
		<MainStack.Screen name="Init" component={BlankComponent} />
		<MainStack.Screen {...LoginScreen.Screen} />
		<MainStack.Screen {...MyGraphScreen.Screen} />
	</MainStack.Navigator>
)

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator()

const MainStack = createNativeStackNavigator()

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator()

const BottomTabNavigator = () => {
	const options = React.useCallback(() => {
		const navigateModal = React.useCallback(() => ModalExample.navigate(), [])

		return {
			title: 'SQLite Test Lab',
			// tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="database" color={color} />,
			headerRight: () => (
				<Pressable onPress={navigateModal} style={pressedStyle}>
					<Text>i</Text>
				</Pressable>
			),
		}
	}, [])

	return (
		<BottomTab.Navigator
			initialRouteName="TabOne"
			screenOptions={{
				tabBarActiveTintColor: store.theme.tint,
				headerShown: false,
			}}
		>
			<BottomTab.Screen name="TabOne" component={BlankComponent} options={options} />
			<BottomTab.Screen
				{...TabTwo.Screen}
				options={{
					title: 'Tab Two',
					// tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	)
}

const pressedStyle = ({ pressed }: { pressed: boolean }) => ({
	opacity: pressed ? 0.5 : 1,
})
