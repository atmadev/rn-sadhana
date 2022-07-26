import React, { useMemo } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import {
	createNativeStackNavigator,
	NativeStackNavigationOptions,
} from '@react-navigation/native-stack'

import { store } from 'store'
import { LoginScreen } from 'screens/LoginScreen'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { SettingsScreen } from 'screens/settings'
import { GraphEditingScreen } from 'screens/editing/GraphEditingScreen'
import { setNavigation } from 'navigation'
import { MyGraphSettingsScreen } from 'screens/settings/MyGraph'
import { renderTabBar } from './TabBar'
import { observer } from 'mobx-react-lite'
import { OtherGraphsScreen } from 'screens/otherGraphs'
import { OtherProfileScreen } from 'screens/otherGraphs/OtherProfileScreen'
import { RegistrationScreen } from 'screens/registration'
import { colors, ORANGE } from 'const/Colors'
import { MyProfileSettingsScreen } from 'screens/settings/MyProfile'
import { ExportCSVScreen } from 'screens/settings/ExportCSV'
import { SearchGraphScreen } from 'screens/otherGraphs/SearchScreen'
import { Spacer } from 'components/Spacer'

const RootStack = createNativeStackNavigator()

export const Navigation = observer(() => {
	return (
		<NavigationContainer
			ref={setNavigation}
			theme={store.colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<RootStack.Navigator>
				<RootStack.Screen name="Splash" component={BlankComponent} options={noHeader} />
				<RootStack.Screen {...LoginScreen.Screen} />
				<RootStack.Screen name="Tab" component={TabNavigator} options={noHeader} />
				<RootStack.Screen {...GraphEditingScreen.Screen} />
				<RootStack.Screen {...RegistrationScreen.Screen} />
			</RootStack.Navigator>
		</NavigationContainer>
	)
})

const LeftStack = createNativeStackNavigator()
const RightStack = createNativeStackNavigator()

const LeftStackNavigator = () => (
	<LeftStack.Navigator>
		<LeftStack.Screen {...MyGraphScreen.Screen} />
		<LeftStack.Screen {...SettingsScreen.Screen} />
		<LeftStack.Screen {...MyGraphSettingsScreen.Screen} />
		<LeftStack.Screen {...MyProfileSettingsScreen.Screen} />
		<LeftStack.Screen {...ExportCSVScreen.Screen} />
	</LeftStack.Navigator>
)

const RightStackNavigator = () => (
	<RightStack.Navigator>
		<RightStack.Screen {...OtherGraphsScreen.Screen} />
		<RightStack.Screen {...OtherProfileScreen.Screen} />
		<RightStack.Screen {...SearchGraphScreen.Screen} />
	</RightStack.Navigator>
)

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
	const screenOptions = useMemo(
		() => ({
			tabBarActiveTintColor: store.theme.tint,
			headerShown: false,
		}),
		[store.theme],
	)

	return (
		<Tab.Navigator screenOptions={screenOptions} tabBar={renderTabBar}>
			<Tab.Screen name="LeftTab" component={LeftStackNavigator} options={MyGraphTapOptions} />
			<Tab.Screen name="RightTab" component={RightStackNavigator} options={OtherGraphsTapOptions} />
		</Tab.Navigator>
	)
}

const BlankComponent = () => <Spacer flex={1} backgroundColor={ORANGE} />

const MyGraphTapOptions = {
	title: 'My Graph',
}

const OtherGraphsTapOptions = {
	title: 'Other Graphs',
}

const noHeader: NativeStackNavigationOptions = { headerShown: false, animation: 'none' }

DefaultTheme.colors.primary = ORANGE
DefaultTheme.colors.background = colors.light.background2

DarkTheme.colors.primary = ORANGE
DarkTheme.colors.background = colors.dark.background2
