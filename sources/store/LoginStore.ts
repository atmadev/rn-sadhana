import { makeAutoObservable } from 'mobx'

class LoginStore {
	constructor() {
		makeAutoObservable(this)
	}

	status = ''
	setStatus = (s: string) => (this.status = s)

	clear = () => {
		this.status = ''
	}
}

export const loginStore = new LoginStore()
