import { Spacer } from 'components/Spacer'
import { ORANGE } from 'const/Colors'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { Button as RNButton } from 'react-native'

export const Button: FC<{ title: string; onPress: () => void; color?: string }> = observer(
	({ title, color = ORANGE, onPress }) => {
		return (
			<Spacer height={44} justifyContent="center">
				<RNButton title={title} color={color} onPress={onPress} />
			</Spacer>
		)
	},
)
