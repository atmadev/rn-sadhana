import React, { FC, useEffect } from 'react'
import { View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { fetchOtherGraphs, searchOtherGraphs } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { otherGraphsStore } from 'store/OtherGraphsStore'
import { OtherGraphItem } from 'shared/types'
import { gloablStyles } from 'const'
import { store } from 'store'
import debounce from 'lodash/debounce'
import { SearchIcon } from 'components/Icons'
import { GRAY_SYSTEM, ORANGE } from 'const/Colors'
import { GraphItem } from './GraphItem'
import { FastText, Spacer } from 'components/Spacer'
import { graphStore } from 'store/GraphStore'
import { MXGraph } from 'store/MXGraph'

// TODO: search no results label
// TODO: search clear button

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
						renderItem={renderFavoriteItem}
					/>
				) : (
					<FlashList
						ListHeaderComponent={ListHeader}
						refreshing={otherGraphsStore.refreshing}
						onRefresh={onRefresh}
						data={otherGraphsStore.items}
						estimatedItemSize={85}
						renderItem={renderItem}
						onEndReached={fetchOtherGraphs}
						onEndReachedThreshold={1}
						keyboardDismissMode="interactive"
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

const NavigationHeaderRight = observer(() => (
	<TouchableOpacity onPress={otherGraphsStore.toggleFavorites}>
		<FastText color={ORANGE}>{otherGraphsStore.showFavorites ? '★' : '☆'}</FastText>
	</TouchableOpacity>
))

const onRefresh = () => fetchOtherGraphs(true)

const renderFavoriteItem = ({ item }: { item: MXGraph }) => {
	return <GraphItem userID={item.userID} />
}

const renderItem = ({ item }: { item: OtherGraphItem }) => {
	return <GraphItem userID={item.user_id} />
}

const ListHeader: FC = observer(() => {
	return (
		<View style={styles.listHeader}>
			<SearchIcon color={GRAY_SYSTEM} />
			<TextInput
				style={styles.searchInput}
				placeholder="Search"
				placeholderTextColor={GRAY_SYSTEM}
				value={otherGraphsStore.searchString}
				onChangeText={onSearch}
			/>
		</View>
	)
})

const ListFooter: FC = observer(() => {
	return otherGraphsStore.loadingPage && otherGraphsStore.loadingPage > 0 ? (
		<ActivityIndicator style={styles.bottomActivityIndicator} />
	) : null
})

const onSearch = (text: string) => {
	otherGraphsStore.setSearchString(text)
	searchDebounced()
}

const searchDebounced = debounce(searchOtherGraphs, 300)

const styles = createStyles({
	listHeader: () => ({
		flexDirection: 'row',
		margin: 10,
		alignItems: 'center',
		backgroundColor: store.theme.background3,
		paddingHorizontal: 10,
		borderRadius: 14,
	}),
	searchInput: () => ({
		height: 40,
		flex: 1,
		marginLeft: 10,
		color: store.theme.text,
		fontSize: 17,
	}),
	bottomActivityIndicator: { marginTop: 50, marginBottom: 70 },
})
