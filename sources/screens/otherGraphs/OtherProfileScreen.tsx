import React, { FC, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { GraphList } from 'screens/graph/List'
import { createScreen, createStyles } from 'screens/utils'
import { graphStore } from 'store/GraphStore'
import { Image, Text } from 'react-native'
import { Device } from 'const'
import { refreshOtherEntries } from 'logic/entries'
import { TouchableOpacity } from 'components/primitives'
import { FastText } from 'components/Spacer'
import { ORANGE } from 'const/Colors'
import { userStore } from 'store/UserStore'
import { userName } from 'utils'

export const OtherProfileScreen = createScreen(
	'OtherProfile',
	observer(() => {
		const graph = graphStore.selected

		useEffect(() => {
			if (graph && graph.entries.size < 2) refreshOtherEntries()
		}, [])

		return graph ? (
			<GraphList userID={graph.userID} onRefresh={refreshOtherEntries} header={Header} trimmed />
		) : null
	}),
	{
		headerTitle: () => {
			const defaultTitle = 'Profile'
			const userID = graphStore.selected?.userID
			if (!userID) return defaultTitle

			const user = userStore.map.get(userID)
			if (!user) return defaultTitle

			return <Text>{userName(user)}</Text>
		},
		headerRight: () => <NavigationHeaderRight />,
	},
)

const NavigationHeaderRight = observer(() =>
	graphStore.selected ? (
		<TouchableOpacity onPress={graphStore.selected.toggleFavorite}>
			<FastText fontSize={20} color={ORANGE}>
				{graphStore.selected.favorite ? '★' : '☆'}
			</FastText>
		</TouchableOpacity>
	) : null,
)

const Header: FC = observer(() => {
	const graph = graphStore.selected
	// TODO: put placeholder here if needed
	const source = useMemo(
		() => (graph ? { uri: userStore.map.get(graph?.userID)?.avatar_url ?? '' } : undefined),
		[],
	)
	return <Image style={styles.headerImage} source={source} />
})

const styles = createStyles({
	headerImage: { width: Device.width, height: Device.width },
})
