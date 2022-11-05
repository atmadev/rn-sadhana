import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren, memo, Attributes } from 'react'
import { View, ViewStyle, TextStyle, Text, ViewProps, StyleSheet } from 'react-native'
import { store } from 'store'

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

export const Separator = observer(() => {
	return <Spacer height={StyleSheet.hairlineWidth} backgroundColor={store.theme.separator} />
})
