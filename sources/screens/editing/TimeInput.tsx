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
	forwardRef<
		RNTextInput | null,
		{ time: MXTime; allInMinutes?: boolean; nextRef?: RefObject<RNTextInput | null> }
	>(({ time, allInMinutes, nextRef }, ref) => {
		const onTypeMinutes = useCallback(
			(minutes: string) => {
				if (allInMinutes) {
					time.setAllInMinutes(minutes)
					if (time.allInMinutesString.length > 2) nextRef?.current?.focus()
					return
				}

				time.setMinutes(minutes)
				if (time.minutesNumber > 5 || time.minutes.length === 2) {
					nextRef?.current?.focus()
				}
			},
			[time, allInMinutes, nextRef],
		)

		return (
			<SubtitledTextInput
				subtitle="minutes"
				placeholder="00"
				value={allInMinutes ? time.allInMinutesString : time.minutes}
				onChangeText={onTypeMinutes}
				maxLength={allInMinutes ? 3 : 2}
				ref={ref}
			/>
		)
	}),
)
