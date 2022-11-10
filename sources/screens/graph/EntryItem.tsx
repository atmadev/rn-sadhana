import React, { FC, useCallback } from 'react'
import { View, Text } from 'react-native'

import { observer } from 'mobx-react-lite'
import { TouchableHighlight } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { Image, ViewStyle } from 'react-native'
import { Spacer } from 'components/Spacer'
import { Device } from 'const'
import { graphStore } from 'store/GraphStore'
import { BLUE, ORANGE, RED, YELLOW } from 'const/Colors'
import { store } from 'store'
import { navigate } from 'navigation'
import { YMD } from 'shared/types'
import { MONTH_MS } from 'shared/dateUtil'
import { graphEditingStore } from 'store/GraphEditingStore'

export const EntryItem: FC<{ ymd: YMD; userID: string; isLast: boolean }> = observer(
	({ ymd, userID, isLast }) => {
		const graph = graphStore.map.get(userID)!
		const entry = graph.entries.get(ymd)
		const date = new Date(ymd)

		const roundsBefore730 = entry?.jcount_730 ? parseInt(entry?.jcount_730) : 0
		const roundsBefore10 = entry?.jcount_1000 ? parseInt(entry?.jcount_1000) : 0
		const roundsBefore18 = entry?.jcount_1800 ? parseInt(entry?.jcount_1800) : 0
		const roundsAfter = entry?.jcount_after ? parseInt(entry?.jcount_after) : 0
		const allRounds = roundsBefore730 + roundsBefore10 + roundsBefore18 + roundsAfter

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
					<Image
						style={styles.kirtan}
						source={entry?.kirtan === '1' ? kirtanActiveIcon : kirtanIcon}
					/>

					{/* READING */}
					<View style={styles.dataItem}>
						<Image
							source={entry?.reading && entry.reading !== '0' ? readingActiveIcon : readingIcon}
						/>
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
					<Text style={styles.dataText}>{allRounds}</Text>
				</View>
				{allRounds > 0 ? (
					<View style={styles.japaLine}>
						{roundsBefore730 > 0 ? (
							<Spacer backgroundColor={YELLOW} flex={roundsBefore730 / allRounds} />
						) : null}
						{roundsBefore10 > 0 ? (
							<Spacer backgroundColor={ORANGE} flex={roundsBefore10 / allRounds} />
						) : null}
						{roundsBefore18 > 0 ? (
							<Spacer backgroundColor={RED} flex={roundsBefore18 / allRounds} />
						) : null}
						{roundsAfter > 0 ? (
							<Spacer backgroundColor={BLUE} flex={roundsAfter / allRounds} />
						) : null}
					</View>
				) : null}
			</View>
		)

		return Date.now() - date.getTime() < 2 * MONTH_MS ? (
			<TouchableHighlight onPress={onPress}>{content}</TouchableHighlight>
		) : (
			content
		)
	},
)

const getUpIcon = require('assets/images/sun-active.png')
const kirtanActiveIcon = require('assets/images/kirtan-active.png')
const kirtanIcon = require('assets/images/kirtan.png')

const readingActiveIcon = require('assets/images/book-active.png')
const readingIcon = require('assets/images/book.png')

const bedIcon = require('assets/images/moon-active.png')

const containerBasicStyle: ViewStyle = {
	marginHorizontal: 10,
	marginVertical: 4,
	height: 50,
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
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
	},
	date: { flexDirection: 'row', alignItems: 'center', width: 30, marginRight: 20 },
	day: () => ({ fontSize: 22, fontWeight: '300', color: store.theme.text }),
	weekday: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#CED2D5',
		margin: 4,
		marginRight: 10,
		marginLeft: 6,
	},
	kirtan: { marginHorizontal: 16 },
	data: { flexDirection: 'row', justifyContent: 'space-between', marginRight: Device.width / 8 },
	dataItem: { flexDirection: 'row', flex: 1 },
	dataText: () => ({ color: store.theme.text }),
	japa: { flexDirection: 'row', alignItems: 'center' },
	japaLine: {
		height: 6,
		right: 0,
		flexDirection: 'row',
		overflow: 'hidden',
	},
})
