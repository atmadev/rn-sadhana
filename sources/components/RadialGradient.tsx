import React, { FC, memo } from 'react'
import { ViewStyle } from 'react-native'
import { Svg, Defs, RadialGradient as SVGRadialGradient, Stop, Ellipse } from 'react-native-svg'
import { Device } from '../const'

export const RadialGradient: FC<{
	containerStyle: ViewStyle
	width: number
	height: number
	colors: string[]
}> = memo(({ containerStyle, width, height, colors }) => {
	const cx = width / 2
	const cy = height / 2
	const rx = width / 1.6
	const ry = height / 1.6
	return (
		<Svg style={{ ...containerStyle, backgroundColor: colors[1] }} width={width} height={height}>
			<Defs>
				{/* @ts-ignore - SVG lib should be updated to have a fix for react 18 types, BUT new lib is not compatible with the expo 45 */}
				<SVGRadialGradient
					id="grad"
					cx={cx}
					cy={Device.ios ? cy : (cy / 2) * 1.2}
					rx={rx}
					ry={ry * 0.9}
					fx={cx}
					fy={cy}
					gradientUnits="userSpaceOnUse"
				>
					<Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
					<Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
				</SVGRadialGradient>
			</Defs>
			<Ellipse cx={cx} cy={cy} rx={rx * 1.5} ry={ry * 1.5} fill="url(#grad)" />
		</Svg>
	)
})

// const styles = StyleSheet.create({
// 	container: { flex: 1 },
// })
