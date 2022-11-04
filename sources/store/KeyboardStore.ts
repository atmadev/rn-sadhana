import { Keyboard, KeyboardEvent, Platform } from 'react-native'
import { makeAutoObservable } from 'mobx'

const isIos = Platform.OS === 'ios'

class KeyboardStore {
	constructor() {
		makeAutoObservable(this)

		Keyboard.addListener(isIos ? 'keyboardWillShow' : 'keyboardDidShow', this.onKeyboardShow)
		Keyboard.addListener(isIos ? 'keyboardWillHide' : 'keyboardDidHide', this.onKeyboardHide)
	}

	isVisible = false
	get keyboardHeight() {
		return this.rootViewHeight - (this.lastKeyboardEvent?.endCoordinates?.screenY ?? 0)
	}

	get visibleKeyboardHeight() {
		return this.isVisible ? this.keyboardHeight : 0
	}

	lastKeyboardEvent: KeyboardEvent | null = null

	rootViewHeight = 0
	setRootViewHeight = (h: number) => (this.rootViewHeight = h)

	private setVisible = (v: boolean, event: KeyboardEvent) => {
		this.isVisible = v
		this.lastKeyboardEvent = event
	}

	private onKeyboardShow = (e: KeyboardEvent) => this.setVisible(true, e)
	private onKeyboardHide = (e: KeyboardEvent) => this.setVisible(false, e)
}

export const keyboardStore = new KeyboardStore()
