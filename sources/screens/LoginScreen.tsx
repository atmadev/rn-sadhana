import React, { useCallback, useEffect, useRef, useState } from 'react'
// prettier-ignore
import { ActivityIndicator, Animated, Easing, Image, Keyboard, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import {
	TouchableHighlight,
	TouchableOpacity,
	FlingGestureHandler,
	TapGestureHandlerStateChangeEvent,
	State,
	Directions,
} from 'react-native-gesture-handler'

import { StatusBar } from 'expo-status-bar'
import { arrowRightWhite, beadsLight, prabhupada, vaishnavaseva } from 'assets/index'
import { Card } from 'components/Card'
import { RadialGradient } from 'components/RadialGradient'
import {
	configureLayoutAnimationFromKeyboardEvent,
	Device,
	GRAY_LIGHT,
	ORANGE,
	ORANGE_LIGHT,
	WHITE,
	doNothing,
} from 'const/index'
import * as Haptics from 'expo-haptics'
import { createScreen } from 'screens/utils'
import { login } from 'logic/auth'
import { MyGraphScreen } from './graph/MyScreen'
import { loginStore } from 'store/LoginStore'

let keyboardMarginBottom = 0
const formHorizontalOffset = new Animated.Value(0)

// TODO: remove after test
let email = 'sanio91@ya.ru'
let password = 'Ale248Vai'

export const LoginScreen = createScreen('Login', () => {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [isInputValid, setInputValid] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const emailInput = useRef<TextInput>(null)
	const passwordInput = useRef<TextInput>(null)

	useEffect(() => {
		const listener = Keyboard.addListener('keyboardWillChangeFrame', (e) => {
			const keyboardVisible = e.endCoordinates.screenY < Device.height
			if (keyboardVisible === isKeyboardVisible) return

			setKeyboardVisible(() => {
				keyboardMarginBottom = Device.height - e.endCoordinates.screenY
				configureLayoutAnimationFromKeyboardEvent(e)
				return keyboardVisible
			})
		})
		return () => listener.remove()
	}, [isKeyboardVisible])

	const loginCallback = useCallback(() => {
		if (!isInputValid) return
		setLoading(true)
		setError(null)

		login(email, password)
			.then((result) => {
				if (result.success) {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
					MyGraphScreen.navigate()
					// TODO:
					// add login store to change message text reactively
				} else {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
					Animated.timing(formHorizontalOffset, {
						toValue: 1,
						useNativeDriver: true,
						duration: 600,
						easing: Easing.linear,
					}).start(() => formHorizontalOffset.setValue(0))

					setError(result.message)
				}
			})
			.finally(() => setLoading(false))
	}, [isInputValid, setLoading, setError])

	const validate = useCallback(() => {
		const state = email.length > 0 && password.length > 0
		setInputValid(state)
		setError(null)
	}, [setInputValid, setError])

	const onEmailChange = useCallback((text: string) => {
		email = text
		validate()
	}, [])

	const onPasswordChange = useCallback((text: string) => {
		password = text
		validate()
	}, [])

	const onTap = useCallback(({ nativeEvent }: TapGestureHandlerStateChangeEvent) => {
		if (nativeEvent.state !== State.ACTIVE) return
		Keyboard.dismiss()
	}, [])

	const focusPassword = useCallback(() => passwordInput.current?.focus(), [passwordInput])

	useEffect(validate, [])

	const buttonDisabled = isLoading || !isInputValid

	return (
		<FlingGestureHandler
			direction={Directions.DOWN}
			onHandlerStateChange={onTap}
			enabled={isKeyboardVisible}
		>
			<View style={styles.container} pointerEvents={isLoading ? 'none' : 'box-none'}>
				<StatusBar style="light" />
				<RadialGradient
					containerStyle={styles.gradient}
					width={Device.width}
					height={Device.height}
					colors={gradientColors}
				/>
				<Image source={prabhupada} style={styles.prabhupada} />
				<Image source={vaishnavaseva} style={styles.vaishnavaseva} />
				{isKeyboardVisible && <View style={styles.dim} />}

				<View style={{ ...styles.content, marginBottom: keyboardMarginBottom }}>
					<Image source={beadsLight} style={styles.beads} />
					<Text style={styles.title}>Садхана</Text>
					{/* TODO: Localize */}

					<Animated.View style={cardContainerStyle}>
						<Card style={styles.card} contentStyle={styles.cardContent}>
							<TextInput
								ref={emailInput}
								placeholder="Логин или e-mail" /* TODO: Localize */
								style={styles.input}
								keyboardAppearance="dark"
								returnKeyType="next"
								enablesReturnKeyAutomatically
								onSubmitEditing={focusPassword}
								onChangeText={onEmailChange}
							/>
							<View style={styles.separator} />
							<TextInput
								ref={passwordInput}
								placeholder="Пароль" /* TODO: Localize */
								style={styles.input}
								secureTextEntry
								keyboardAppearance="dark"
								returnKeyType="done"
								enablesReturnKeyAutomatically
								onSubmitEditing={loginCallback}
								onChangeText={onPasswordChange}
							/>
							<TouchableHighlight
								style={{ ...styles.button, backgroundColor: buttonDisabled ? GRAY_LIGHT : ORANGE }}
								underlayColor={ORANGE_LIGHT}
								activeOpacity={1}
								onPress={loginCallback}
								disabled={buttonDisabled}
							>
								{isLoading ? (
									<ActivityIndicator color={WHITE} />
								) : (
									<Text style={styles.buttonText}>
										{'Войти  ' /* TODO: Localize */}
										<Image source={arrowRightWhite} style={styles.arrow} />
									</Text>
								)}
							</TouchableHighlight>
						</Card>
					</Animated.View>
					{error ? <Text style={styles.error}>⚠️ {error}</Text> : null}
					{loginStore.status.length > 0 ? (
						<Text style={styles.error}>{loginStore.status}</Text>
					) : null}
				</View>
				<View style={styles.registrationContainer}>
					<TouchableOpacity
						style={styles.registrationButton}
						onPress={doNothing}
						hitSlop={{ top: 16, bottom: 16 }}
					>
						<Text style={styles.registrationText}>Регистрация</Text>
						{/* TODO: Localize */}
					</TouchableOpacity>
				</View>
			</View>
		</FlingGestureHandler>
	)
})

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'stretch', justifyContent: 'center' },
	gradient: { position: 'absolute', flex: 1, left: 0, top: 0, zIndex: -3 },
	prabhupada: { position: 'absolute', left: 0, top: 10, zIndex: -2 },
	dim: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: '#000',
		opacity: 0.6,
	},
	content: { alignItems: 'center' },
	beads: {},
	title: { fontSize: Device.height * 0.05, color: WHITE, fontWeight: '300' },
	card: { width: '100%', marginTop: Device.height * 0.03 },
	cardContent: { alignItems: 'stretch', backgroundColor: WHITE },
	input: { height: 45, paddingHorizontal: 10, textAlign: 'center', fontSize: 17 },
	separator: { height: StyleSheet.hairlineWidth, backgroundColor: GRAY_LIGHT, marginHorizontal: 8 },
	button: { height: 59, justifyContent: 'center' },
	buttonText: {
		color: WHITE,
		fontSize: 20,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontWeight: '500',
	},
	arrow: { transform: [{ translateY: 1 }] },
	error: { position: 'absolute', bottom: -26, textAlign: 'center', color: WHITE, fontSize: 14 },
	registrationContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', zIndex: 1 },
	registrationButton: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: WHITE },
	registrationText: { textAlign: 'center', fontSize: 12, color: WHITE },
	vaishnavaseva: {
		position: 'absolute',
		right: Device.width * 0.04,
		bottom: Device.height * 0.03,
		zIndex: -1,
	},
})

const cardContainerStyle: Animated.WithAnimatedObject<ViewStyle> = {
	alignItems: 'stretch',
	width: '70%',
	transform: [
		{
			translateX: formHorizontalOffset.interpolate({
				inputRange: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
				outputRange: [0.0, -15.0, 15.0, -10.0, 10.0, -5.0, 5.0, -2.5, 2.5, 0.0, 0.0],
			}),
		},
	],
}

const gradientColors = ['#FFB651', '#623D3D']
