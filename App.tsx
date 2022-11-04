import React, { FC, useEffect } from 'react'
import { LayoutChangeEvent, useColorScheme } from 'react-native'

import { observer } from 'mobx-react-lite'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { store } from 'store'
import { Navigation } from 'navigation'
import { initApp } from 'logic'
import { onAppStart } from 'logic'
import { keyboardStore } from 'store/KeyboardStore'

const App = observer(() => {
	useEffect(() => {
		initApp()
	}, [])

	return store.inited ? (
		<SafeAreaProvider style={flex1} onLayout={onLayout}>
			<StatusBar />
			<Navigation />
			<Hooks />
		</SafeAreaProvider>
	) : null
})

const Hooks: FC = () => {
	const colorScheme = useColorScheme()

	useEffect(() => {
		store.setColorScheme(colorScheme)
	}, [colorScheme])

	useEffect(() => {
		onAppStart()
	}, [])

	return null
}

const flex1 = { flex: 1 }

const onLayout = (e: LayoutChangeEvent) =>
	keyboardStore.setRootViewHeight(e.nativeEvent.layout.height)

export default App
