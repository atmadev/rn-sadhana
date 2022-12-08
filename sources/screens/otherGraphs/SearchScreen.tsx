import React, { FC, useCallback, useEffect, useRef } from 'react'
import { View, TextInput, ActivityIndicator } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createScreen, createStyles } from 'screens/utils'
import { searchGraph } from 'logic/entries'
import { FlashList } from '@shopify/flash-list'
import { gloablStyles } from 'const'
import { store } from 'store'
import { SearchIcon } from 'components/Icons'
import { GRAY_SYSTEM } from 'const/Colors'
import { GraphItem } from './GraphItem'
import { FastText, Spacer } from 'components/Spacer'
import { OtherGraphItem } from 'shared/types'
import { searchGraphStore } from 'store/SearchGraphStore'
import { TouchableOpacity } from 'components/primitives'

export const SearchGraphScreen = createScreen(
	'SearchGraph',
	observer(() => {
		return (
			<View style={gloablStyles.flex1}>
				<FlashList
					ListHeaderComponent={ListHeader}
					data={searchGraphStore.items}
					estimatedItemSize={85}
					renderItem={renderItem}
					keyboardDismissMode="interactive"
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
				<TouchableOpacity onPress={onClear}>
					<FastText padding={5} fontSize={25}>
						⨯
					</FastText>
				</TouchableOpacity>
			) : null}
		</View>
	)
})

const ListFooter: FC = observer(() => {
	console.log(
		searchGraphStore.searchingTime,
		searchGraphStore.searchString.length,
		searchGraphStore.items.length,
	)
	if (searchGraphStore.searchString.length === 0 || searchGraphStore.items.length > 0)
		return <Spacer height={10} />

	return searchGraphStore.searchingTime !== null ? (
		<ActivityIndicator style={styles.bottomActivityIndicator} />
	) : (
		<FastText textAlign="center" fontSize={20} color={store.theme.text2} marginTop={47}>
			No Results
		</FastText>
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
