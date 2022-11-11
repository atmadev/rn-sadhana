import React, { FC, useEffect, useMemo } from 'react'
import { View, Text, ViewStyle, Image, TextInput } from 'react-native'
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
import { SearchIcon } from 'assets/svg/Icons'
import { GRAY_SYSTEM } from 'const/Colors'

// TODO: graph list

export const OtherGraphsScreen = createScreen(
	'OtherGraphs',
	observer(() => {
		useEffect(() => {
			onRefresh()
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

const onSearch = (text: string) => {
	otherGraphsStore.setSearchString(text)
	searchDebounced()
}

const searchDebounced = debounce(searchOtherGraphs, 300)

const GraphItem: FC<{ item: OtherGraphItem }> = observer(({ item }) => {
	const avatarSource = useMemo(() => ({ uri: item.avatarUrl }), [item.avatarUrl])
	const rounds = parseRounds(item)

	return (
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
})
