import React, { FC, useEffect } from 'react'
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native'
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
import { userStore } from 'store/UserStore'
import { globalStyles } from 'globalStyles'

export const OtherGraphsScreen = createScreen(
	'OtherGraphs',
	observer(() => {
		useEffect(() => {
			if (otherGraphsStore.items.length === 0) onRefresh()
		}, [])

		return (
			<View style={gloablStyles.flex1}>
				{otherGraphsStore.showFavorites ? (
					userStore.favoriteIDs.size > 0 ? (
						<FlashList data={graphStore.favorites} estimatedItemSize={88} renderItem={renderItem} />
					) : (
						<Text style={globalStyles.emptyListDummyText}>
							Press ☆ in profile screen to add Favorites
						</Text>
					)
				) : (
					<FlashList
						refreshing={otherGraphsStore.refreshing}
						onRefresh={onRefresh}
						data={otherGraphsStore.items}
						estimatedItemSize={88}
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
		<Spacer flexDirection="row" marginTop={1} marginRight={-10}>
			<TouchableOpacity onPress={showSearch} style={globalStyles.barButton}>
				<FastText>🔍</FastText>
			</TouchableOpacity>
			<TouchableOpacity onPress={otherGraphsStore.toggleFavorites} style={globalStyles.barButton}>
				<FastText color={ORANGE} fontSize={20}>
					{otherGraphsStore.showFavorites ? '★' : '☆'}
				</FastText>
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
