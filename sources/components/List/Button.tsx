import { Spacer } from 'components/Spacer'
import { ORANGE } from 'const/Colors'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { ActivityIndicator, Button as RNButton } from 'react-native'

export const Button: FC<{
	title: string
	onPress: () => void
	color?: string
	disabled?: boolean
	loading?: boolean
}> = observer(({ title, color = ORANGE, onPress, disabled, loading }) => {
	return (
		<Spacer height={44} justifyContent="center">
			{loading ? (
				<ActivityIndicator />
			) : (
				<RNButton title={title} color={color} onPress={onPress} disabled={disabled} />
			)}
		</Spacer>
	)
})
