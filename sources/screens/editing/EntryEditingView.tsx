import React, { FC } from 'react'
import { TextStyle, StyleSheet } from 'react-native'
import { View, Text, ScrollView } from 'react-native'

import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'
import { YMD } from 'types'
import { HoursInput, MinutesInput } from './TimeInput'
import { JapaInput } from './JapaInput'
import { SwitcherCell } from './SwitcherCell'
import { BLUE, ORANGE, RED, YELLOW } from 'const/Colors'
import { store } from 'store'
import { graphStore } from 'store/GraphStore'
import { Device } from 'const'
import { persistentStore } from 'store/PersistentStore'

export const EntryEditingView: FC<{ ymd: YMD }> = observer(({ ymd }) => {
	const entry = graphStore.my!.getMXEntry(ymd)
	const refs = entry.refs

	let currentRefIndex = 0

	const currentRefs = () => ({
		ref: refs[currentRefIndex],
		nextRef: currentRefIndex < refs.length - 1 ? refs[++currentRefIndex] : undefined,
	})

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			keyboardDismissMode="on-drag"
		>
			{persistentStore.wakeUpEnabled ? (
				<>
					<Text style={styles.title}>Wake Up</Text>
					<View style={styles.row}>
						<HoursInput time={entry.wakeUp} {...currentRefs()} />
						<View style={styles.verticalSeparator} />
						<MinutesInput time={entry.wakeUp} {...currentRefs()} />
					</View>
				</>
			) : null}
			<Text style={styles.title}>Japa rounds</Text>
			<View style={styles.row}>
				<JapaInput
					style={styles.japa7}
					title="before 7:30"
					value={entry.japa7}
					onChangeText={entry.setJapa7}
					{...currentRefs()}
				/>
				<View style={styles.verticalSeparator} />
				<JapaInput
					style={styles.japa10}
					title="before 10:00"
					value={entry.japa10}
					onChangeText={entry.setJapa10}
					{...currentRefs()}
				/>
				<View style={styles.verticalSeparator} />
				<JapaInput
					style={styles.japa18}
					title="before 18:00"
					value={entry.japa18}
					onChangeText={entry.setJapa18}
					{...currentRefs()}
				/>
				<View style={styles.verticalSeparator} />
				<JapaInput
					style={styles.japa24}
					title="after 18:00"
					value={entry.japa24}
					onChangeText={entry.setJapa24}
					{...currentRefs()}
				/>
			</View>

			<Text style={styles.title}>Reading books</Text>
			<View style={styles.row}>
				{!persistentStore.readingInMinutes ? (
					<>
						<HoursInput time={entry.reading} {...currentRefs()} />
						<View style={styles.verticalSeparator} />
					</>
				) : null}

				<MinutesInput
					time={entry.reading}
					allInMinutes={persistentStore.readingInMinutes}
					{...currentRefs()}
				/>
			</View>

			<SwitcherCell title="Kirtan" value={entry.kirtan} onValueChange={entry.setKirtan} />
			{persistentStore.serviceEnabled ? (
				<SwitcherCell title="Service" value={entry.service} onValueChange={entry.setService} />
			) : null}
			{persistentStore.yogaEnabled ? (
				<SwitcherCell title="Yoga" value={entry.yoga} onValueChange={entry.setYoga} />
			) : null}
			{persistentStore.lectionsEnabled ? (
				<SwitcherCell title="Lections" value={entry.lections} onValueChange={entry.setLections} />
			) : null}

			{persistentStore.bedEnabled ? (
				<>
					<Text style={styles.title}>Sleep</Text>
					<View style={styles.row}>
						<HoursInput time={entry.sleep} {...currentRefs()} />
						<View style={styles.verticalSeparator} />
						<MinutesInput time={entry.sleep} {...currentRefs()} />
					</View>
				</>
			) : null}
		</ScrollView>
	)
})

const styles = createStyles({
	container: () => ({ flex: 1, backgroundColor: store.theme.background, width: Device.width }),
	contentContainer: { alignItems: 'stretch' },
	title: (): TextStyle => ({
		fontSize: 15,
		textAlign: 'center',
		marginTop: 8,
		color: store.theme.text,
	}),
	row: () => ({
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingTop: 8,
		padding: 13,
		borderBottomColor: store.theme.separator,
		borderBottomWidth: StyleSheet.hairlineWidth,
	}),

	verticalSeparator: () => ({
		width: StyleSheet.hairlineWidth,
		backgroundColor: store.theme.separator,
		paddingVertical: 12,
	}),
	japa7: {
		color: YELLOW,
	},
	japa10: {
		color: ORANGE,
	},
	japa18: {
		color: RED,
	},
	japa24: {
		color: BLUE,
	},
})
