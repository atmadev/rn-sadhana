import { FC, createElement, useEffect, useRef, ForwardedRef } from 'react'

import { computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { store } from 'store'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { ScreenList } from 'navigation/ScreenList'

export const createScreen = <Name extends keyof ScreenList>(
	name: Name,
	rawComponent: FC<ScreenList[Name]>,
	options?: NativeStackNavigationOptions,
) => {
	// @ts-ignore
	const component: FC = observer((props) => createElement(rawComponent, props?.route?.params))

	return {
		Screen: {
			name,
			component,
			options,
		},
	}
}

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

export const useForwardedRef = <T>(ref: ForwardedRef<T>) => {
	const innerRef = useRef<T | null>(null)
	useEffect(() => {
		if (!ref) return
		if (typeof ref === 'function') {
			ref(innerRef.current)
		} else {
			ref.current = innerRef.current
		}
	})

	return innerRef
}
