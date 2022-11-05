import { TouchableHighlight } from 'components/primitives'
import { Spacer } from 'components/Spacer'
import { GRAY_ULTRALIGHT } from 'const/Colors'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { Image, Text, View } from 'react-native'
import { createStyles } from 'screens/utils'

export const Row: FC<{ title: string; arrow?: true; onPress?: () => void }> = observer(
	({ title, arrow, onPress }) => {
		const content = (
			<View style={styles.container}>
				<Text style={styles.title}>{title}</Text>
				<Spacer flex={1} />
				{arrow ? <Image source={require('assets/images/arrow-right-gray.png')} /> : null}
			</View>
		)

		return onPress ? (
			<TouchableHighlight onPress={onPress} underlayColor={GRAY_ULTRALIGHT}>
				{content}
			</TouchableHighlight>
		) : (
			content
		)
	},
)

const styles = createStyles({
	container: { flexDirection: 'row', height: 44, alignItems: 'center', paddingHorizontal: 16 },
	title: { fontSize: 16 },
})
