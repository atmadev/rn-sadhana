import React, { FC, useCallback } from 'react'
import { View, Text } from 'react-native'

import { observer } from 'mobx-react-lite'
import { TouchableHighlight } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { Image } from 'react-native'
import { FastText, Spacer } from 'components/Spacer'
import { graphStore } from 'store/GraphStore'
import { BLUE, ORANGE, RED, YELLOW } from 'const/Colors'
import { store } from 'store'
import { navigate } from 'navigation'
import { Entry, YMD } from 'shared/types'
import { MONTH_MS } from 'shared/dateUtil'
import { graphEditingStore } from 'store/GraphEditingStore'
import { userStore } from 'store/UserStore'
import { parseRounds } from 'utils'

export const EntryItem: FC<{ userID: string; ymd: YMD; maxRounds?: number; isLast: boolean }> =
	observer(({ userID, ymd, maxRounds, isLast }) => {
		const graph = graphStore.map.get(userID)!
		const entry = graph.entries.get(ymd)
		const date = new Date(ymd)

		const rounds = parseRounds(entry, maxRounds)

		const onPress = useCallback(() => {
			graphEditingStore.selectYMD(ymd)
			navigate('GraphEditing')
		}, [ymd])

		return (
			<View style={isLast ? styles.backgroundLast : styles.background}>
				<TouchableHighlight
					style={styles.touchable}
					underlayColor={store.theme.highlight}
					onPress={onPress}
					disabled={userID !== userStore.myID || Date.now() - date.getTime() > 2 * MONTH_MS}
				>
					<View style={styles.container}>
						<View style={styles.date}>
							<Text style={styles.day}>{date.getUTCDate()}</Text>
							<Text style={styles.weekday}>{date.getUTCDay()}</Text>
						</View>
						<View style={styles.content}>
							<EntryDataItem entry={entry} />
							<JapaLine {...rounds} />
						</View>
						<Text style={styles.roundsText}>{rounds.all > 0 ? rounds.all : ''}</Text>
					</View>
				</TouchableHighlight>
			</View>
		)
	})

export const EntryDataItem: FC<{ entry?: Entry }> = observer(({ entry }) => {
	return (
		<View style={styles.dataContainer}>
			{/* GET UP */}
			<TimeItem data={entry?.opt_wake_up} icon={wakeUpIcon} iconActive={wakeUpIconActive} />
			{/* KIRTAN */}
			<Image style={styles.kirtan} source={entry?.kirtan === '1' ? kirtanIconActive : kirtanIcon} />

			{/* READING */}
			<View style={styles.dataItem}>
				<Image source={entry?.reading && entry.reading !== '0' ? readingIconActive : readingIcon} />
				<FastText
					fontSize={12}
					marginLeft={5}
					color={
						entry?.reading && entry.reading !== '0' ? store.theme.text : store.theme.placeholder
					}
				>
					{entry?.reading ?? 0}
				</FastText>
			</View>

			{/* BED */}
			<TimeItem data={entry?.opt_sleep} icon={bedIcon} iconActive={bedIconActive} />
		</View>
	)
})

export const TimeItem: FC<{ data?: string | null; icon: any; iconActive: any }> = observer(
	({ data, icon, iconActive }) => (
		<View style={styles.dataItem}>
			{data ? (
				<>
					<Image source={iconActive} />
					<Spacer width={5} />
					<Text style={styles.dataText}>{data}</Text>
				</>
			) : (
				<>
					<Image source={icon} />
					<View style={styles.dataItemDummy} />
				</>
			)}
		</View>
	),
)

interface JapaRounds {
	before730: number
	before10: number
	before18: number
	after: number
	all: number
	left: number
}

export const JapaLine: FC<JapaRounds> = (rounds) => (
	<View>
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
			{rounds.left > 0 ? (
				<Spacer
					backgroundColor={store.theme.separator2}
					flex={rounds.all > 0 ? rounds.left / rounds.all : 1}
				/>
			) : null}
		</View>
		<Spacer
			{...styles.sixteenRoundsMark}
			marginLeft={`${(16 / (rounds.all + rounds.left)) * 100}%`}
		/>
	</View>
)

const wakeUpIcon = require('assets/images/sun.png')
const wakeUpIconActive = require('assets/images/sun-active.png')

const kirtanIcon = require('assets/images/kirtan.png')
const kirtanIconActive = require('assets/images/kirtan-active.png')

const readingIcon = require('assets/images/book.png')
const readingIconActive = require('assets/images/book-active.png')

const bedIcon = require('assets/images/moon.png')
const bedIconActive = require('assets/images/moon-active.png')

const styles = createStyles({
	background: {
		marginVertical: 4,
		marginHorizontal: 10,
	},
	backgroundLast: {
		marginVertical: 4,
		marginHorizontal: 10,
		marginBottom: 11,
	},
	touchable: () => ({
		backgroundColor: store.theme.background,
		borderRadius: 6,
		overflow: 'hidden',
	}),
	container: () => ({
		flexDirection: 'row',
		paddingHorizontal: 10,
		alignItems: 'center',
		height: 50,
	}),
	content: {
		flex: 1,
		margin: 10,
		marginTop: 14,
		justifyContent: 'space-between',
	},
	date: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 40,
		marginRight: 10,
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
	dataText: () => ({ color: store.theme.text, fontSize: 12 }),
	japaLine: {
		height: 6,
		flexDirection: 'row',
		borderRadius: 3,
		overflow: 'hidden',
		marginTop: 8,
	},
	sixteenRoundsMark: {
		width: 1,
		height: 4,
		backgroundColor: '#DADADA',
		marginTop: 1,
		transform: [{ translateX: -1 }],
	},
	roundsText: () => ({
		fontSize: 12,
		color: store.theme.text,
		alignSelf: 'flex-end',
		marginBottom: 6,
		width: 15,
		textAlign: 'center',
	}),
	dataItemDummy: () => ({
		flex: 1,
		maxWidth: 30,
		height: 3,
		borderRadius: 1.5,
		overflow: 'hidden',
		backgroundColor: store.theme.background3,
		marginLeft: 5,
	}),
})
