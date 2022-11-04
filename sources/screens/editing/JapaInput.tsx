import React, { forwardRef, RefObject, useCallback } from 'react'
import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { observer } from 'mobx-react-lite'
import { SubtitledTextInput } from './SubtitledTextInput'

export const JapaInput = observer(
	forwardRef<
		RNTextInput | null,
		{
			title: string
			nextRef?: RefObject<RNTextInput | null>
		} & TextInputProps
	>(({ title, value, onChangeText, nextRef, ...inputProps }, ref) => {
		const onType = useCallback(
			(value: string) => {
				if (value.length <= 2) onChangeText?.(value)
				if (value.length > 1) nextRef?.current?.focus()
			},
			[value, onChangeText, nextRef],
		)

		return (
			<SubtitledTextInput
				ref={ref}
				subtitle={title}
				placeholder="0"
				value={value}
				onChangeText={onType}
				{...inputProps}
			/>
		)
	}),
)
