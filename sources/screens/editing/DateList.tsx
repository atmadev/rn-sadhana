import React, { FC, useMemo } from 'react'
import { Animated, ViewStyle } from 'react-native'
import { View } from 'react-native'

import { calendarStore } from 'store/CalendarStore'
import { FastText } from 'components/Spacer'
import { Device } from 'const'
import { store } from 'store'
import { createStyles } from 'screens/utils'
import { observer } from 'mobx-react-lite'
import { graphEditingStore } from 'store/GraphEditingStore'

export const DateList: FC = observer(() => {
	const style = useMemo(
		(): Animated.WithAnimatedObject<ViewStyle> => ({
			height: 30,
			flexDirection: 'row',
			justifyContent: 'flex-end',
			paddingRight: (Device.width - dateItemWidth) / 2,
			transform: [
				{
					translateX: graphEditingStore.scrollX.interpolate({
						inputRange: [-1, 0, 1],
						outputRange: [-itemK, 0, itemK],
					}),
				},
			],
		}),
		[graphEditingStore.scrollX],
	)

	const selectedYMD = graphEditingStore.currentYMD

	return (
		<View style={styles.container}>
			<Animated.View style={style}>
				{calendarStore.lastYearDays
					.filter((_, index) => index - graphEditingStore.index < 10)
					.map((ymd) => {
						const selected = selectedYMD === ymd
						return (
							<View style={styles.item} key={ymd}>
								<FastText color={selected ? store.theme.text : store.theme.text2} fontWeight="bold">
									{ymd}
								</FastText>
							</View>
						)
					})
					.reverse()}
			</Animated.View>
		</View>
	)
})

const dateItemWidth = 100
const itemK = dateItemWidth / Device.width

const styles = createStyles({
	container: () => ({ backgroundColor: store.theme.background2 }),
	item: { width: dateItemWidth, justifyContent: 'center', alignItems: 'center' },
})
