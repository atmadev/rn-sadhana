import React, { FC, useCallback } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BottomTabDescriptor } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { TabBarIconMyGraph, TabBarIconOtherGraphs } from 'components/Icons'
import { Device } from 'const'
import { ORANGE, GRAY_LIGHT, GRAY } from 'const/Colors'
import { observer } from 'mobx-react-lite'
import { TouchableOpacity } from 'components/primitives'
import { createStyles } from 'screens/utils'
import { store } from 'store'
import { Spacer, FastText } from 'components/Spacer'
import { plusButton } from 'assets/index'
import { navigate } from 'navigation'

export const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />

const TabBar: FC<BottomTabBarProps> = observer(({ state, descriptors, navigation }) => {
	return (
		<View style={styles.tabBar}>
			<TabBarItem
				IconComponent={TabBarIconMyGraph}
				navigation={navigation}
				descriptor={descriptors[state.routes[0].key]}
				focused={state.index === 0}
				offset={1}
			/>
			<TouchableOpacity onPress={onPressPlus}>
				<Image style={styles.plusImage} source={plusButton} />
			</TouchableOpacity>
			<TabBarItem
				IconComponent={TabBarIconOtherGraphs}
				navigation={navigation}
				descriptor={descriptors[state.routes[1].key]}
				focused={state.index === 1}
			/>
		</View>
	)
})

const TabBarItem: FC<
	{
		IconComponent: FC<{ color: string }>
		descriptor: BottomTabDescriptor
		focused: boolean
		offset?: number
	} & Pick<BottomTabBarProps, 'navigation'>
> = observer(({ IconComponent, navigation, descriptor, focused, offset }) => {
	const { route, options } = descriptor
	const onPress = useCallback(() => {
		const event = navigation.emit({
			type: 'tabPress',
			target: route.key,
			canPreventDefault: true,
		})

		if (!focused && !event.defaultPrevented) {
			// The `merge: true` option makes sure that the params inside the tab screen are preserved
			navigation.navigate({ name: route.name, merge: true, params: undefined })
		}
	}, [route.key, route.name, focused])

	const color = focused ? ORANGE : GRAY_LIGHT

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.itemContainer}>
				{offset !== undefined ? <Spacer height={offset} /> : null}
				<View style={styles.iconContainer}>
					<IconComponent color={color} />
				</View>
				<Spacer height={30} marginTop={-(offset ?? 0)}>
					<FastText color={focused ? ORANGE : GRAY} fontSize={10}>
						{options.title}
					</FastText>
				</Spacer>
			</View>
		</TouchableOpacity>
	)
})

const onPressPlus = () => navigate('GraphEditing')

const styles = createStyles({
	tabBar: () => ({
		flexDirection: 'row',
		height: 50 + Device.safeBottomInset,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: store.theme.separator,
		backgroundColor: store.theme.background,
		justifyContent: 'space-evenly',
	}),
	itemContainer: {
		alignItems: 'center',
	},
	iconContainer: {
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
	},
	plusImage: {
		marginTop: Device.ios ? 5 : 4,
	},
})
