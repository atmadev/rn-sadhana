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
} from 'react-native'

import { observer } from 'mobx-react-lite'
import { Dynamic } from 'screens/utils'

export const View: FC<MakeDynamicStyle<ViewProps>> = observer((props) => {
	const { style, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style

	return <RNView style={finalStyle} {...restProps} />
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

export const TextInput: FC<MakeDynamicStyle<TextInputProps>> = observer((props) => {
	const { style, ...restProps } = props
	const finalStyle = style instanceof Function ? style() : style

	return <RNTextInput style={finalStyle} {...restProps} />
})

type MakeDynamicStyle<T> = {
	[K in keyof T]: K extends 'style' ? Dynamic<T[K]> : T[K]
}
