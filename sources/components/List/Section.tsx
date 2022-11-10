import React, { FC, PropsWithChildren } from 'react'
import { View, Text } from 'react-native'

import { Separator } from 'components/Spacer'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { store } from 'store'

export const Section: FC<PropsWithChildren<{ title?: string }>> = observer(
	({ title, children }) => {
		return (
			<View style={styles.container}>
				{title ? <Text style={styles.title}>{title.toUpperCase()}</Text> : null}
				<View style={styles.content}>
					{Array.isArray(children)
						? children.map((node, index) => (
								<View key={'section' + index}>
									{node}
									{index !== children.length - 1 ? <Separator key={'separator' + index} /> : null}
								</View>
						  ))
						: children}
				</View>
			</View>
		)
	},
)

const styles = createStyles({
	title: () => ({ marginLeft: 32, marginBottom: 8, fontSize: 13, color: store.theme.text2 }),
	container: () => ({
		marginVertical: 12,
	}),
	content: () => ({
		backgroundColor: store.theme.background,
		borderRadius: 10,
		marginHorizontal: 16,
		overflow: 'hidden',
	}),
})
