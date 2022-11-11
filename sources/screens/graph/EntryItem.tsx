import React, { FC, useCallback } from 'react'
import { View, Text } from 'react-native'

import { observer } from 'mobx-react-lite'
import { TouchableHighlight } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { Image, ViewStyle } from 'react-native'
import { Spacer } from 'components/Spacer'
import { graphStore } from 'store/GraphStore'
import { BLUE, ORANGE, RED, YELLOW } from 'const/Colors'
import { store } from 'store'
import { navigate } from 'navigation'
import { Entry, YMD } from 'shared/types'
import { MONTH_MS } from 'shared/dateUtil'
import { graphEditingStore } from 'store/GraphEditingStore'
import { userStore } from 'store/UserStore'

export const EntryItem: FC<{ ymd: YMD; userID: string; isLast: boolean }> = observer(
	({ ymd, userID, isLast }) => {
		const graph = graphStore.map.get(userID)!
		const entry = graph.entries.get(ymd)
		const date = new Date(ymd)

		const rounds = parseRounds(entry)

		const onPress = useCallback(() => {
			graphEditingStore.selectYMD(ymd)
			navigate('GraphEditing')
		}, [ymd])

		const content = (
			<View style={isLast ? styles.containerLast : styles.container}>
				<View style={styles.content}>
					<View style={styles.date}>
						<Text style={styles.day}>{date.getUTCDate()}</Text>
						<Text style={styles.weekday}>{date.getUTCDay()}</Text>
					</View>
					<EntryDataItem entry={entry} allRounds={rounds.all} />
				</View>
				<JapaLine {...rounds} />
			</View>
		)

		return userID === userStore.myID && Date.now() - date.getTime() < 2 * MONTH_MS ? (
			<TouchableHighlight underlayColor={store.theme.highlight} onPress={onPress}>
				{content}
			</TouchableHighlight>
		) : (
			content
		)
	},
)

export const EntryDataItem: FC<{ entry?: Entry; allRounds: number }> = ({ entry }) => {
	return (
		<View style={styles.dataContainer}>
			{/* GET UP */}
			<View style={styles.dataItem}>
				<Image source={getUpIcon} />
				{entry?.opt_wake_up ? (
					<>
						<Spacer width={10} />
						<Text style={styles.dataText}>{entry.opt_wake_up}</Text>
					</>
				) : null}
			</View>

			{/* KIRTAN */}
			<Image style={styles.kirtan} source={entry?.kirtan === '1' ? kirtanActiveIcon : kirtanIcon} />

			{/* READING */}
			<View style={styles.dataItem}>
				<Image source={entry?.reading && entry.reading !== '0' ? readingActiveIcon : readingIcon} />
				{entry?.reading && entry.reading !== '0' ? (
					<>
						<Spacer width={10} />
						<Text style={styles.dataText}>{entry.reading}</Text>
					</>
				) : null}
			</View>

			{/* BED */}
			<View style={styles.dataItem}>
				<Image source={bedIcon} />
				{entry?.opt_sleep ? (
					<>
						<Spacer width={10} />
						<Text style={styles.dataText}>{entry.opt_sleep}</Text>
					</>
				) : null}
			</View>
			{/* TODO: make fixed size for it <Text style={styles.dataText}>{allRounds}</Text> */}
		</View>
	)
}

interface JapaRounds {
	before730: number
	before10: number
	before18: number
	after: number
	all: number
}

export const JapaLine: FC<JapaRounds> = (rounds) => {
	return rounds.all > 0 ? (
		<View style={styles.japaLine}>
			{rounds.before730 > 0 ? (
				<Spacer backgroundColor={YELLOW} flex={rounds.before730 / rounds.all} />
			) : null}
			{rounds.before10 > 0 ? (
				<Spacer backgroundColor={ORANGE} flex={rounds.before10 / rounds.all} />
			) : null}
			{rounds.before18 > 0 ? (
				<Spacer backgroundColor={RED} flex={rounds.before18 / rounds.all} />
			) : null}
			{rounds.after > 0 ? <Spacer backgroundColor={BLUE} flex={rounds.after / rounds.all} /> : null}
		</View>
	) : null
}

export const parseRounds = (entry?: Entry) => {
	const before730 = entry?.jcount_730 ? parseInt(entry?.jcount_730) : 0
	const before10 = entry?.jcount_1000 ? parseInt(entry?.jcount_1000) : 0
	const before18 = entry?.jcount_1800 ? parseInt(entry?.jcount_1800) : 0
	const after = entry?.jcount_after ? parseInt(entry?.jcount_after) : 0
	const all = before730 + before10 + before18 + after
	return {
		before730,
		before10,
		before18,
		after,
		all,
	}
}

const getUpIcon = require('assets/images/sun-active.png')
const kirtanActiveIcon = require('assets/images/kirtan-active.png')
const kirtanIcon = require('assets/images/kirtan.png')

const readingActiveIcon = require('assets/images/book-active.png')
const readingIcon = require('assets/images/book.png')

const bedIcon = require('assets/images/moon-active.png')

const containerBasicStyle: ViewStyle = {
	marginHorizontal: 10,
	marginVertical: 4,
	borderRadius: 6,
	overflow: 'hidden',
}

const styles = createStyles({
	container: () => ({
		...containerBasicStyle,
		backgroundColor: store.theme.background,
	}),
	containerLast: () => ({
		...containerBasicStyle,
		backgroundColor: store.theme.background,
		marginBottom: 11,
	}),
	content: {
		flex: 1,
		margin: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	date: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 40,
		marginRight: 20,
	},
	day: () => ({ fontSize: 22, fontWeight: '300', color: store.theme.text }),
	weekday: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#CED2D5',
	},
	kirtan: { marginHorizontal: 16 },
	dataContainer: { flexDirection: 'row' },
	dataItem: { flexDirection: 'row', flex: 1, alignItems: 'center' },
	dataText: () => ({ color: store.theme.text }),
	japa: { flexDirection: 'row', alignItems: 'center' },
	japaLine: {
		height: 8,
		flexDirection: 'row',
	},
})
