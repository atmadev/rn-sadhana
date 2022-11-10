import React, { FC, useEffect, useMemo } from 'react'
import { View, Text, ViewStyle, StyleSheet, Image } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { fetchOtherGraphs } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { otherGraphsStore } from 'store/OtherGraphsStore'
import { OtherGraphItem } from 'shared/types'
import { gloablStyles } from 'const'
import { trimmed } from 'shared/utils'
import { store } from 'store'

// TODO: render item
// TODO: paging
// TODO: search
// TODO: graph list

export const OtherGraphsScreen = createScreen(
	'OtherGraphs',
	observer(() => {
		useEffect(() => {
			fetchOtherGraphs()
		}, [])

		return (
			<View style={gloablStyles.flex1}>
				<FlashList data={otherGraphsStore.items} estimatedItemSize={70} renderItem={renderItem} />
			</View>
		)
	}),
)

const renderItem = ({ item }: { item: OtherGraphItem }) => {
	return <GraphItem item={item} />
}

const GraphItem: FC<{ item: OtherGraphItem }> = observer(({ item }) => {
	const avatarSource = useMemo(() => ({ uri: item.avatarUrl }), [item.avatarUrl])

	return (
		<View style={styles.item}>
			<Image style={styles.image} source={avatarSource} />
			<Text style={styles.title}>
				{trimmed(item.spiritual_name) ?? trimmed(item.karmic_name) ?? trimmed(item.user_nicename)}
			</Text>
		</View>
	)
})

const styles = createStyles({
	item: (): ViewStyle => ({
		height: 70,
		borderBottomColor: store.theme.separator,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
	}),
	image: {
		width: 54,
		height: 54,
		borderRadius: 27,
		marginRight: 10,
	},
	title: () => ({
		color: store.theme.text,
	}),
})
