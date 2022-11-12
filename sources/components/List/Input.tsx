import React, { FC, useCallback, useRef } from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { store } from 'store'
import { Device } from 'const'
import { ORANGE } from 'const/Colors'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export const Input: FC<{ title: string } & TextInputProps> = observer((props) => {
	const { title, ...textInputProps } = props

	const ref = useRef<TextInput | null>(null)

	const onPress = useCallback(() => {
		ref.current?.focus()
	}, [ref])

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.title}>{title}</Text>
				<TextInput {...textInputProps} style={styles.input} selectionColor={ORANGE} ref={ref} />
			</View>
		</TouchableWithoutFeedback>
	)
})

const styles = createStyles({
	container: { flexDirection: 'row', height: 44, alignItems: 'center', paddingHorizontal: 16 },
	title: () => ({ fontSize: 16, color: store.theme.text, width: Device.width / 2.5 }),
	input: () => ({ fontSize: 16, flex: 1 }),
})
