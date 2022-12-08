import React, { FC, useEffect } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { fetchOtherGraphs } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { otherGraphsStore } from 'store/OtherGraphsStore'
import { gloablStyles } from 'const'
import { ORANGE } from 'const/Colors'
import { GraphItem } from './GraphItem'
import { FastText, Spacer } from 'components/Spacer'
import { graphStore } from 'store/GraphStore'
import { navigate } from 'navigation'

export const OtherGraphsScreen = createScreen(
	'OtherGraphs',
	observer(() => {
		useEffect(() => {
			if (otherGraphsStore.items.length === 0) onRefresh()
		}, [])

		return (
			<View style={gloablStyles.flex1}>
				{otherGraphsStore.showFavorites ? (
					<FlashList
						ListHeaderComponent={<Spacer height={10} />}
						data={graphStore.favorites}
						estimatedItemSize={85}
						renderItem={renderItem}
					/>
				) : (
					<FlashList
						refreshing={otherGraphsStore.refreshing}
						onRefresh={onRefresh}
						data={otherGraphsStore.items}
						estimatedItemSize={85}
						renderItem={renderItem}
						onEndReached={fetchOtherGraphs}
						onEndReachedThreshold={1}
						ListFooterComponent={ListFooter}
					/>
				)}
			</View>
		)
	}),
	{
		headerRight: () => <NavigationHeaderRight />,
	},
)

const NavigationHeaderRight = observer(() => {
	return (
		<Spacer flexDirection="row">
			<TouchableOpacity onPress={otherGraphsStore.toggleFavorites}>
				<FastText color={ORANGE} padding={5}>
					{otherGraphsStore.showFavorites ? '★' : '☆'}
				</FastText>
			</TouchableOpacity>
			<Spacer width={10} />
			<TouchableOpacity onPress={showSearch}>
				<FastText padding={5}>🔍</FastText>
			</TouchableOpacity>
		</Spacer>
	)
})

const showSearch = () => navigate('SearchGraph')

const onRefresh = () => fetchOtherGraphs(true)

const renderItem = ({ item }: { item: any }) => {
	return <GraphItem userID={item.userID ?? item.user_id} />
}

const ListFooter: FC = observer(() => {
	return otherGraphsStore.loadingPage && otherGraphsStore.loadingPage > 0 ? (
		<ActivityIndicator style={styles.bottomActivityIndicator} />
	) : null
})

const styles = createStyles({
	bottomActivityIndicator: { marginTop: 50, marginBottom: 70 },
})
