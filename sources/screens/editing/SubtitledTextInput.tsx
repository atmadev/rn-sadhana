import React, { forwardRef, useCallback, useMemo } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { observer } from 'mobx-react-lite'
import { View, Text, TextInput } from 'react-native'
import { createStyles, useForwardedRef } from 'screens/utils'
import { ORANGE } from 'const/Colors'
import { store } from 'store'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export const SubtitledTextInput = observer(
	forwardRef<
		RNTextInput,
		{
			subtitle: string
		} & TextInputProps
	>(({ subtitle, style, ...textInputProps }, forwardedRef) => {
		const mergedStyle = useMemo(() => [styles.input, style], [style, styles.input])

		const ref = useForwardedRef<TextInput>(forwardedRef)

		const onPress = useCallback(() => ref.current?.focus(), [ref])

		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.container}>
					<TextInput
						style={mergedStyle}
						ref={ref}
						returnKeyType={'next'}
						placeholderTextColor={store.theme.placeholder}
						selectTextOnFocus
						maxLength={2}
						selectionColor={ORANGE}
						keyboardType="number-pad"
						{...textInputProps}
					/>
					<Text style={styles.subtitle}>{subtitle}</Text>
				</View>
			</TouchableWithoutFeedback>
		)
	}),
)

const styles = createStyles({
	container: { alignItems: 'center', width: 85 },
	input: () => ({ fontSize: 25, color: store.theme.text }),
	subtitle: () => ({
		fontSize: 13,
		color: store.theme.placeholder,
		marginTop: 4,
		zIndex: -1,
	}),
})
