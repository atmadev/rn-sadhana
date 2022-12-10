import { TouchableHighlight } from 'components/primitives'
import { Spacer } from 'components/Spacer'
import { observer } from 'mobx-react-lite'
import { navigate } from 'navigation'
import React, { FC, useMemo, useCallback, useEffect } from 'react'
import { View, Image, Text, ViewStyle } from 'react-native'
import { EntryDataItem, JapaLine } from 'screens/graph/EntryItem'
import { store } from 'store'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'
import { userName } from 'utils'
import { createStyles } from 'screens/utils'
import { refreshOtherEntries } from 'logic/entries'
import { parseRounds } from 'utils'
import { globalStyles } from 'globalStyles'

// TODO: check names

export const GraphItem: FC<{ userID: string }> = observer(({ userID }) => {
	const onPress = useCallback(() => {
		if (userID === userStore.myID) {
			navigate('MyGraph')
			return
		}

		graphStore.setSelectedID(userID)
		navigate('OtherProfile')
	}, [userID])

	useEffect(() => {
		const graph = graphStore.map.get(userID)
		if (graph && graph.entries.size === 0 && graph.favorite) refreshOtherEntries(graph.userID)
	}, [])

	const avatarSource = useMemo(
		() => ({ uri: userStore.map.get(userID)?.avatar_url ?? '' }),
		[userID],
	)

	const graph = graphStore.map.get(userID)
	const user = userStore.map.get(userID)

	if (!graph || !user) return null

	const lastEntry = graph?.lastEntry ?? undefined
	const rounds = parseRounds(lastEntry)

	return (
		<View style={styles.background}>
			<TouchableHighlight
				style={styles.item}
				underlayColor={store.theme.highlight}
				onPress={onPress}
			>
				<View style={globalStyles.row}>
					<Image style={styles.image} source={avatarSource} />
					<Spacer flex={1}>
						<Text style={styles.title}>{userName(user)}</Text>
						<EntryDataItem entry={lastEntry} />
						<JapaLine {...rounds} />
					</Spacer>
					<Text style={styles.roundsText}>{rounds.all > 0 ? rounds.all : ''}</Text>
				</View>
			</TouchableHighlight>
		</View>
	)
})

const styles = createStyles({
	background: {
		marginTop: 10,
		marginHorizontal: 10,
	},
	item: (): ViewStyle => ({
		backgroundColor: store.theme.background,
		borderRadius: 14,
		overflow: 'hidden',
		padding: 10,
		height: 78,
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
		marginBottom: 6,
	}),
	roundsText: () => ({
		fontSize: 12,
		color: store.theme.text,
		alignSelf: 'flex-end',
		width: 15,
		textAlign: 'center',
		marginLeft: 5,
		marginBottom: -3,
		marginRight: 2,
	}),
})
