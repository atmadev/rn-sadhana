import React, { FC } from 'react'
import { Image, Text, View } from 'react-native'

import { TouchableHighlight } from 'components/primitives'
import { Spacer } from 'components/Spacer'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { store } from 'store'

export const Row: FC<{
	imageUrl?: string | null
	title: string
	value?: string
	arrow?: true
	onPress?: () => void
}> = observer(({ imageUrl, title, value, arrow, onPress }) => {
	const content = (
		<View style={styles.container}>
			{imageUrl ? <Image style={styles.image} source={{ uri: imageUrl }} /> : null}
			<Text style={styles.title}>{title}</Text>
			<Spacer flex={1} />
			{value ? <Text style={styles.value}>{value}</Text> : null}
			{arrow ? <Image source={require('assets/images/arrow-right-gray.png')} /> : null}
		</View>
	)

	return onPress ? (
		<TouchableHighlight onPress={onPress} underlayColor={store.theme.highlight}>
			{content}
		</TouchableHighlight>
	) : (
		content
	)
})

const styles = createStyles({
	container: { flexDirection: 'row', minHeight: 44, alignItems: 'center', paddingHorizontal: 16 },
	image: { width: 60, height: 60, marginVertical: 12, borderRadius: 6, marginRight: 10 },
	title: () => ({ fontSize: 16, color: store.theme.text }),
	value: () => ({ fontSize: 15, color: store.theme.text2 }),
})
