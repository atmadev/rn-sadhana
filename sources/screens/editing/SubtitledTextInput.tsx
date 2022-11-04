import React, { forwardRef, useMemo } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { observer } from 'mobx-react-lite'
import { View, Text, TextInput } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { ORANGE } from 'const/Colors'
import { store } from 'store'

export const SubtitledTextInput = observer(
	forwardRef<
		RNTextInput,
		{
			subtitle: string
		} & TextInputProps
	>(({ subtitle, style, ...textInputProps }, ref) => {
		const mergedStyle = useMemo(() => [styles.input(), style], [style, styles.input()])

		return (
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
		)
	}),
)

const styles = createStyles({
	container: {
		alignItems: 'center',
		width: 85,
	},
	input: () => ({
		fontSize: 25,
		color: store.theme.text,
	}),
	subtitle: () => ({
		fontSize: 13,
		color: store.theme.placeholder,
		marginTop: 4,
		zIndex: -1,
	}),
})
