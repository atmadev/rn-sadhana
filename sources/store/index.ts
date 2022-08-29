import { colors } from 'constants/Colors'
import { makeAutoObservable } from 'mobx'
import { ColorSchemeName } from 'react-native'
import { fetchLocalStore, removeItemFromLocalStore, setObjectToLocalStore } from 'services/localDB'
import { Tokens } from 'services/network/vsShapes'

class Store {
	constructor() {
		makeAutoObservable(this)
	}

	inited = false
	setInited = () => (this.inited = true)

	colorScheme: ColorSchemeName = null
	setColorScheme = (scheme: ColorSchemeName) => (this.colorScheme = scheme)

	get theme() {
		return this.colorScheme === 'dark' ? colors.dark : colors.light
	}

	tokens: Tokens | null = null
	setTokens = (tokens: Tokens | null) => {
		this.tokens = tokens
		if (tokens) setObjectToLocalStore('tokens', tokens)
		else removeItemFromLocalStore('tokens')
	}

	loadFromDisk = async () => {
		const localStore = await fetchLocalStore()
		this.tokens = localStore.tokens ?? null
	}
}

export const store = new Store()
