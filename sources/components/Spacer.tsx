import React, { FC, PropsWithChildren, memo, Attributes } from 'react'
import { View, ViewStyle, TextStyle, Text, ViewProps } from 'react-native'

export const Spacer: FC<
	PropsWithChildren<ViewStyle> & Pick<ViewProps, 'pointerEvents'> & Pick<Attributes, 'key'>
> = memo(({ children, testID, pointerEvents, key, ...style }) => {
	return (
		<View
			children={children}
			style={style}
			testID={testID}
			pointerEvents={pointerEvents}
			key={key}
		/>
	)
})

export const FastText: FC<PropsWithChildren<TextStyle>> = memo(({ children, ...style }) => {
	return <Text children={children} style={style} />
})
