import React, { FC } from 'react'
import {
	Image as RNImage,
	ImageProps,
	Text as RNText,
	TextProps,
	View as RNView,
	ViewProps,
	TextInput as RNTextInput,
	TextInputProps,
	ScrollView as RNScrollView,
	ScrollViewProps,
	TouchableHighlight as RNTouchableHighlight,
} from 'react-native'

import { TouchableHighlight as GHTouchableHighlight } from 'react-native-gesture-handler'
import { observer } from 'mobx-react-lite'
import { Dynamic } from 'screens/utils'
import { forwardRef } from 'react'
import { Device } from 'const'

export const View: FC<MakeDynamicStyle<ViewProps>> = observer((props) => {
	const { style, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style

	return <RNView style={finalStyle} {...restProps} />
})

export const ScrollView: FC<MakeDynamicStyle<ScrollViewProps>> = observer((props) => {
	const { style, contentContainerStyle, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style
	const finalContentStyle =
		contentContainerStyle instanceof Function ? contentContainerStyle() : contentContainerStyle

	return (
		<RNScrollView style={finalStyle} contentContainerStyle={finalContentStyle} {...restProps} />
	)
})

export const Text: FC<MakeDynamicStyle<TextProps>> = observer((props) => {
	const { style, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style

	return <RNText style={finalStyle} {...restProps} />
})

export const Image: FC<MakeDynamicStyle<ImageProps>> = observer((props) => {
	const { style, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style

	return <RNImage style={finalStyle} {...restProps} />
})

export const TextInput = observer(
	forwardRef<RNTextInput, MakeDynamicStyle<TextInputProps>>((props, ref) => {
		const { style, ...restProps } = props
		const finalStyle = style instanceof Function ? style() : style

		return <RNTextInput style={finalStyle} {...restProps} ref={ref} />
	}),
)

type MakeDynamicStyle<T> = {
	[K in keyof T]: K extends 'style' | 'contentContainerStyle' ? Dynamic<T[K]> : T[K]
}

export const TouchableHighlight = Device.ios ? GHTouchableHighlight : RNTouchableHighlight
