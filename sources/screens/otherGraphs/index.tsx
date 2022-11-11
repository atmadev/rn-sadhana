import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { View, Text, ViewStyle, Image, TextInput, ActivityIndicator } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { fetchOtherGraphs, searchOtherGraphs } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { otherGraphsStore } from 'store/OtherGraphsStore'
import { OtherGraphItem } from 'shared/types'
import { gloablStyles } from 'const'
import { trimmed } from 'shared/utils'
import { store } from 'store'
import { EntryDataItem, JapaLine, parseRounds } from 'screens/graph/EntryItem'
import { Spacer } from 'components/Spacer'
import debounce from 'lodash/debounce'
import { SearchIcon } from 'components/Icons'
import { GRAY_SYSTEM } from 'const/Colors'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { navigate } from 'navigation'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'

// TODO: graph list
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
			</View>
		)
	}),
)

const onRefresh = () => fetchOtherGraphs(true)

const renderItem = ({ item }: { item: OtherGraphItem }) => {
	return <GraphItem item={item} />
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

const GraphItem: FC<{ item: OtherGraphItem }> = observer(({ item }) => {
	const avatarSource = useMemo(() => ({ uri: item.avatarUrl }), [item.avatarUrl])
	const rounds = parseRounds(item)

	const onPress = useCallback(() => {
		if (item.user_id === userStore.myID) {
			navigate('MyGraph')
			return
		}

		graphStore.setSelectedID(item.user_id)
		graphStore.selected!.setItem(item)
		navigate('OtherProfile')
	}, [item])

	return (
		<TouchableHighlight underlayColor={store.theme.highlight} onPress={onPress}>
			<View style={styles.item}>
				<Spacer flex={1} flexDirection="row" alignItems="center" margin={10}>
					<Image style={styles.image} source={avatarSource} />
					<Spacer flex={1}>
						<Text style={styles.title}>
							{trimmed(item.spiritual_name) ??
								trimmed(item.karmic_name) ??
								trimmed(item.user_nicename)}
						</Text>
						<Spacer height={12} />
						<EntryDataItem entry={item} allRounds={rounds.all} />
					</Spacer>
				</Spacer>
				<JapaLine {...rounds} />
			</View>
		</TouchableHighlight>
	)
})

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
	item: (): ViewStyle => ({
		marginBottom: 10,
		marginHorizontal: 10,
		backgroundColor: store.theme.background,
		borderRadius: 14,
		overflow: 'hidden',
	}),
	image: {
		width: 54,
		height: 54,
		borderRadius: 10,
		marginRight: 10,
	},
	title: () => ({
		color: store.theme.text,
		fontSize: 15,
	}),
	bottomActivityIndicator: { marginTop: 50, marginBottom: 70 },
})
