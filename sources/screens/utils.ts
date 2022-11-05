import { FC, createElement } from 'react'

import { computed } from 'mobx'
import { ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { store } from 'store'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { ScreenList } from 'navigation/ScreenList'

export const createScreen = <Name extends keyof ScreenList>(
	name: Name,
	rawComponent: FC<ScreenList[Name]>,
	options?: NativeStackNavigationOptions,
) => ({
	Screen: {
		name,
		get component() {
			// @ts-ignore
			return ({ route: { params } }) => createElement(rawComponent, params)
		},
		options,
	},
})

export type Style = ViewStyle | TextStyle | ImageStyle

export type Dynamic<T> = T | (() => T)

type DynamicStyle = Dynamic<Style>
type DynamicStyles = { [key: string]: DynamicStyle }

// Convert incoming functional styles to the property styles, e.g. () => Style to the
type StaticStyles<T> = {} & { [P in keyof T]: T[P] extends () => infer R ? R : T[P] }

export const createStyles = <T extends DynamicStyles>(styles: T) => {
	Object.entries(Object.getOwnPropertyDescriptors(styles)).forEach(([key, descriptor]) => {
		const func = descriptor.value instanceof Function ? descriptor.value : null
		if (func)
			Object.defineProperty(styles, key, {
				get: dynamicStyle(func),
			})
	})
	return styles as StaticStyles<T>
}

const dynamicStyle = (creator: () => Style) => {
	const computedStyle = computed(creator)

	return () => (store.inited ? computedStyle.get() : {})
}
