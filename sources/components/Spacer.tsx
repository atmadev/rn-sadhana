import React, { FC, PropsWithChildren, memo } from 'react'
import { View, ViewStyle, TextStyle, Text, ViewProps } from 'react-native'

export const Spacer: FC<PropsWithChildren<ViewStyle> & Pick<ViewProps, 'pointerEvents'>> = memo(
	({ children, testID, pointerEvents, ...style }) => {
		return <View children={children} style={style} testID={testID} pointerEvents={pointerEvents} />
	},
)

export const FastText: FC<PropsWithChildren<TextStyle>> = memo(({ children, ...style }) => {
	return <Text children={children} style={style} />
})
