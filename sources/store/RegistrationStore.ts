import { makeAutoObservable } from 'mobx'

class RegistrationStore {
	constructor() {
		makeAutoObservable(this)
	}

	loading = false
	setLoading = (_: boolean) => (this.loading = _)

	spiritualName = ''
	setSpiritualName = (_: string) => (this.spiritualName = _)

	firstName = ''
	setFirstName = (_: string) => (this.firstName = _)

	lastName = ''
	setLastName = (_: string) => (this.lastName = _)

	email = ''
	setEmail = (_: string) => (this.email = _)

	password = ''
	setPassword = (_: string) => (this.password = _)

	confirmPassword = ''
	setConfirmPassword = (_: string) => (this.confirmPassword = _)

	get buttonEnabled() {
		return (
			!this.loading &&
			this.firstName.length > 0 &&
			this.lastName.length > 0 &&
			this.email.length > 5 &&
			this.password.length > 7 &&
			this.confirmPassword.length === this.password.length
		)
	}
}

export let registrationStore = new RegistrationStore()

export const clearRegistrationStore = () => (registrationStore = new RegistrationStore())
