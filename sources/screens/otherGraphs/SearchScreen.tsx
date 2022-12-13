import React, { FC, useCallback, useEffect, useRef } from 'react'
import { View, TextInput, ActivityIndicator, Text, Image } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { searchGraph } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { gloablStyles } from 'const'
import { store } from 'store'
import { SearchIcon } from 'components/Icons'
import { GRAY_SYSTEM } from 'const/Colors'
import { GraphItem } from './GraphItem'
import { Spacer } from 'components/Spacer'
import { OtherGraphItem } from 'types'
import { searchGraphStore } from 'store/SearchGraphStore'
import { TouchableOpacity } from 'components/primitives'
import { textClearDark, textClearLight } from 'assets/index'
import { globalStyles } from 'globalStyles'

export const SearchGraphScreen = createScreen(
	'SearchGraph',
	observer(() => {
		return (
			<View style={gloablStyles.flex1}>
				<FlashList
					ListHeaderComponent={ListHeader}
					data={searchGraphStore.items}
					estimatedItemSize={88}
					renderItem={renderItem}
					keyboardDismissMode="on-drag"
					ListFooterComponent={ListFooter}
				/>
			</View>
		)
	}),
)

const renderItem = ({ item }: { item: OtherGraphItem }) => {
	return <GraphItem userID={item.user_id} />
}

const ListHeader: FC = observer(() => {
	const ref = useRef<TextInput | null>(null)

	useEffect(() => {
		if (ref.current) setTimeout(() => ref.current!.focus(), 350)
	}, [ref.current])

	const onClear = useCallback(() => {
		searchGraphStore.clear()
		ref.current?.focus()
	}, [ref])

	return (
		<View style={styles.listHeader}>
			<SearchIcon color={GRAY_SYSTEM} />
			<TextInput
				ref={ref}
				style={styles.searchInput}
				placeholder="Search"
				placeholderTextColor={GRAY_SYSTEM}
				value={searchGraphStore.searchString}
				onChangeText={onSearch}
			/>
			{searchGraphStore.searchString.length > 0 ? (
				// @ts-ignore
				<TouchableOpacity onPress={onClear} style={gloablStyles.barButton}>
					<Image source={store.colorScheme === 'dark' ? textClearDark : textClearLight} />
				</TouchableOpacity>
			) : null}
		</View>
	)
})

const ListFooter: FC = observer(() => {
	if (searchGraphStore.searchString.length === 0 || searchGraphStore.items.length > 0)
		return <Spacer height={10} />

	return searchGraphStore.searchingTime !== null ? (
		<ActivityIndicator style={styles.bottomActivityIndicator} />
	) : (
		<Text style={globalStyles.emptyListDummyText}>No Results</Text>
	)
})

const onSearch = (text: string) => {
	searchGraphStore.setSearchString(text)
	if (text.length > 0) searchGraph()
}

const styles = createStyles({
	listHeader: () => ({
		flexDirection: 'row',
		margin: 10,
		marginBottom: 0,
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
