import React, { FC, memo, ReactNode } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

export const Card: FC<{ style: ViewStyle; contentStyle?: ViewStyle; children?: ReactNode }> = memo(
	(props) => {
		return (
			<View style={[styles.container, props.style]}>
				<View style={[styles.content, props.contentStyle]}>{props.children}</View>
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: { shadowColor: '#503515', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 1 } },
	content: { borderRadius: 7, overflow: 'hidden' },
})
