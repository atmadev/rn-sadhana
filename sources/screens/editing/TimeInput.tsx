import React, { forwardRef, RefObject, useCallback } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { observer } from 'mobx-react-lite'
import { MXTime } from 'store/MXTime'
import { SubtitledTextInput } from './SubtitledTextInput'

export const HoursInput = observer(
	forwardRef<RNTextInput | null, { time: MXTime; nextRef?: RefObject<RNTextInput | null> }>(
		({ time, nextRef }, ref) => {
			const onTypeHours = useCallback(
				(hours: string) => {
					time.setHours(hours)
					if (time.hoursNumber > 2) {
						nextRef?.current?.focus()
					}
				},
				[time, nextRef],
			)

			return (
				<SubtitledTextInput
					subtitle="hours"
					placeholder="00"
					value={time.hours}
					onChangeText={onTypeHours}
					ref={ref}
				/>
			)
		},
	),
)
// TODO: convert to hours option
export const MinutesInput = observer(
	forwardRef<RNTextInput | null, { time: MXTime; nextRef?: RefObject<RNTextInput | null> }>(
		({ time, nextRef }, ref) => {
			const onTypeMinutes = useCallback(
				(minutes: string) => {
					time.setMinutes(minutes)
					if (time.minutesNumber > 5 || time.minutes.length === 2) {
						nextRef?.current?.focus()
					}
				},
				[time, nextRef],
			)

			return (
				<SubtitledTextInput
					subtitle="minutes"
					placeholder="00"
					value={time.minutes}
					onChangeText={onTypeMinutes}
					ref={ref}
				/>
			)
		},
	),
)
