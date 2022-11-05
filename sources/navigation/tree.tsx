/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'

import { TabTwo } from 'screens/TabTwoScreen'
import { BlankComponent } from './utils'
import { store } from 'store'
import { observer } from 'mobx-react-lite'
import { LoginScreen } from 'screens/LoginScreen'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { SettingsScreen } from 'screens/settings'
import { GraphEditingScreen } from 'screens/editing/GraphEditingScreen'
import { setNavigation } from 'navigation'
import { MyGraphSettingsScreen } from 'screens/settings/MyGraph'

export const Navigation = observer(() => {
	return (
		<NavigationContainer
			ref={setNavigation}
			theme={store.colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<RootStack.Navigator>
				<RootStack.Screen {...LoginScreen.Screen} />
				<RootStack.Screen {...MyGraphScreen.Screen} />
				<RootStack.Screen {...SettingsScreen.Screen} />
				<RootStack.Screen {...MyGraphSettingsScreen.Screen} />
				<RootStack.Screen {...GraphEditingScreen.Screen} />
				<RootStack.Screen name="MainStack" component={MainStackContainer} />
				<RootStack.Screen
					name="Root"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
				/>
				{/* <RootStack.Group screenOptions={{ presentation: 'modal' }}>
					<RootStack.Screen {...ModalExample.Screen} />
				</RootStack.Group> */}
			</RootStack.Navigator>
		</NavigationContainer>
	)
})

// TODO: change blank component to the splash
export const MainStackContainer = () => (
	<MainStack.Navigator screenOptions={{ headerShown: true }}>
		<MainStack.Screen name="Init" component={BlankComponent} />
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
		return {
			title: 'SQLite Test Lab',
			// tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="database" color={color} />,
			// headerRight: () => (
			// 	<Pressable onPress={navigateModal} style={pressedStyle}>
			// 		<Text>i</Text>
			// 	</Pressable>
			// ),
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
