import {
	Platform,
	Dimensions,
	LayoutAnimation,
	KeyboardEventEasing,
	KeyboardEvent,
	StyleSheet,
} from 'react-native'
import { initialWindowMetrics } from 'react-native-safe-area-context'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const Device = {
	ios: Platform.OS === 'ios',
	android: Platform.OS === 'android',
	height: Dimensions.get('window').height,
	width: Dimensions.get('window').width,
	majorIOSVersion: Number.parseInt(Platform.Version as string),
	safeTopInset: initialWindowMetrics?.insets.top ?? 0,
	statusBarHeight: getStatusBarHeight(),
	safeBottomInset: initialWindowMetrics?.insets.bottom ?? 0,
	small: Dimensions.get('window').height < 600,
}

export const gloablStyles = StyleSheet.create({
	flex1: {
		flex: 1,
	},
	alignCenter: {
		alignItems: 'center',
	},
})

export const configureLayoutAnimationFromKeyboardEvent = (e: KeyboardEvent) =>
	LayoutAnimation.configureNext(LayoutAnimationKeyboardConfig(e.duration, e.easing))

export const LayoutAnimationKeyboardConfig = (
	duration = 250,
	type: KeyboardEventEasing = 'keyboard',
) => ({
	duration,
	create: { type, property: LayoutAnimation.Properties.opacity },
	update: { type },
	delete: { type, property: LayoutAnimation.Properties.opacity },
})

export const doNothing = () => {}
