import React, { FC, useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { GraphList } from 'screens/graph/List'
import { createScreen, createStyles } from 'screens/utils'
import { graphStore } from 'store/GraphStore'
import { Image } from 'react-native'
import { Device } from 'const'
import { refreshOtherEntries } from 'logic/entries'

export const OtherProfileScreen = createScreen(
	'OtherProfile',
	observer(() => {
		const graph = graphStore.selected

		useEffect(() => {
			if (graph?.entries.size === 0) refreshOtherEntries()
		}, [])

		return graph ? (
			<GraphList userID={graph.userID} onRefresh={refreshOtherEntries} header={Header} trimmed />
		) : null
	}),
)

const Header: FC = observer(() => {
	const graph = graphStore.selected
	// TODO: put placeholder here if needed
	const source = useMemo(() => ({ uri: graph?.item?.avatarUrl ?? '' }), [])
	return <Image style={styles.headerImage} source={source} />
})

const styles = createStyles({
	headerImage: { width: Device.width, height: Device.width },
})
