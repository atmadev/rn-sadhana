import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text } from 'components/primitives'
import { Entry } from 'shared/types'
import { createStyles } from 'screens/utils'
import { Image } from 'react-native'
import { Spacer } from 'components/Spacer'
import { Device } from 'const'

export const EntryItem: FC<{ date: Date; entry: Entry }> = observer(({ date, entry }) => {
	const roundsBefore730 = parseInt(entry?.jcount_730 ?? '0')
	const roundsBefore10 = parseInt(entry?.jcount_1000 ?? '0')
	const roundsBefore18 = parseInt(entry?.jcount_1800 ?? '0')
	const roundsAfter = parseInt(entry?.jcount_after ?? '0')
	const allRounds = roundsBefore730 + roundsBefore10 + roundsBefore18 + roundsAfter

	return (
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
						<Text style={styles.dataText}>{entry?.opt_wake_up ?? ''}</Text>
					</View>
				</View>
				<View style={styles.japa}>
					<View style={styles.japaLine}>
						{allRounds > 0 ? (
							<>
								<Spacer backgroundColor="#FFDB00" flex={roundsBefore730 / allRounds} />
								<Spacer backgroundColor="#FF8C00" flex={roundsBefore10 / allRounds} />
								<Spacer backgroundColor="#FF0048" flex={roundsBefore18 / allRounds} />
								<Spacer backgroundColor="#007AFF" flex={roundsAfter / allRounds} />
							</>
						) : null}
					</View>
					<Text style={styles.dataText}>{allRounds}</Text>
				</View>
			</View>
		</View>
	)
})

const styles = createStyles({
	container: {
		marginHorizontal: 12,
		marginVertical: 2,
		flexDirection: 'row',
		alignItems: 'center',
		height: 50,
		borderRadius: 5,
		backgroundColor: 'white',
		paddingHorizontal: 13,
	},
	day: { fontSize: 22, fontWeight: '300' },
	weekday: { fontSize: 10, fontWeight: 'bold', color: '#CED2D5', margin: 4, marginRight: 10 },
	content: { flex: 1, marginTop: 4 },
	data: { flexDirection: 'row', justifyContent: 'space-between', marginRight: Device.width / 8 },
	dataItem: { flexDirection: 'row', width: Device.width / 10 },
	dataText: {},
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
