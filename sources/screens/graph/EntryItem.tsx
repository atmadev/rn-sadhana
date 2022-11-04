import React, { FC, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { Image } from 'react-native'
import { Spacer } from 'components/Spacer'
import { Device } from 'const'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { graphStore } from 'store/GraphStore'
import { BLUE, ORANGE, RED, YELLOW } from 'const/Colors'
import { store } from 'store'
import { navigate } from 'navigation'
import { YMD } from 'shared/types'

export const EntryItem: FC<{ ymd: YMD; userId: string }> = observer(({ ymd, userId }) => {
	const graph = graphStore.map.get(userId)!
	const date = new Date(ymd)
	const entry = graph.entries.get(ymd)

	const roundsBefore730 = parseInt(entry?.jcount_730 ?? '0')
	const roundsBefore10 = parseInt(entry?.jcount_1000 ?? '0')
	const roundsBefore18 = parseInt(entry?.jcount_1800 ?? '0')
	const roundsAfter = parseInt(entry?.jcount_after ?? '0')
	const allRounds = roundsBefore730 + roundsBefore10 + roundsBefore18 + roundsAfter

	const onPress = useCallback(() => {
		navigate('GraphEditing', { ymd })
	}, [ymd])

	return (
		<TouchableHighlight onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.day}>{date.getUTCDate()}</Text>
				<Text style={styles.weekday}>{date.getUTCDay()}</Text>
				<View style={styles.content}>
					<View style={styles.data}>
						{/* GET UP */}
						<View style={styles.dataItem}>
							<Image source={require('assets/images/sun-active.png')} />
							<Spacer width={10} />
							<Text style={styles.dataText}>{entry?.opt_wake_up ?? ''}</Text>
						</View>

						{/* KIRTAN */}
						<Image
							source={
								entry?.kirtan === '1'
									? require('assets/images/kirtan-active.png')
									: require('assets/images/kirtan.png')
							}
						/>

						{/* READING */}
						<View style={styles.dataItem}>
							<Image
								source={
									entry?.reading && entry.reading !== '0'
										? require('assets/images/book-active.png')
										: require('assets/images/book.png')
								}
							/>
							<Spacer width={10} />
							<Text style={styles.dataText}>{entry?.reading ?? '0'}</Text>
						</View>

						{/* BED */}
						<View style={styles.dataItem}>
							<Image source={require('assets/images/moon-active.png')} />
							<Spacer width={10} />
							<Text style={styles.dataText}>{entry?.opt_sleep ?? ''}</Text>
						</View>
					</View>
					<View style={styles.japa}>
						<View style={styles.japaLine}>
							{allRounds > 0 ? (
								<>
									<Spacer backgroundColor={YELLOW} flex={roundsBefore730 / allRounds} />
									<Spacer backgroundColor={ORANGE} flex={roundsBefore10 / allRounds} />
									<Spacer backgroundColor={RED} flex={roundsBefore18 / allRounds} />
									<Spacer backgroundColor={BLUE} flex={roundsAfter / allRounds} />
								</>
							) : null}
						</View>
						<Text style={styles.dataText}>{allRounds}</Text>
					</View>
				</View>
			</View>
		</TouchableHighlight>
	)
})

const styles = createStyles({
	container: () => ({
		marginHorizontal: 12,
		marginVertical: 2,
		flexDirection: 'row',
		alignItems: 'center',
		height: 50,
		borderRadius: 5,
		backgroundColor: store.theme.background,
		paddingHorizontal: 13,
	}),
	day: () => ({ fontSize: 22, fontWeight: '300', color: store.theme.text }),
	weekday: { fontSize: 10, fontWeight: 'bold', color: '#CED2D5', margin: 4, marginRight: 10 },
	content: { flex: 1, marginTop: 4 },
	data: { flexDirection: 'row', justifyContent: 'space-between', marginRight: Device.width / 8 },
	dataItem: { flexDirection: 'row', width: Device.width / 10 },
	dataText: () => ({ color: store.theme.text }),
	japa: { flexDirection: 'row', alignItems: 'center' },
	japaLine: {
		height: 7,
		borderRadius: 3.5,
		flexDirection: 'row',
		overflow: 'hidden',
		flex: 1,
		marginRight: 6,
		backgroundColor: '#F2F4F5',
	},
})
