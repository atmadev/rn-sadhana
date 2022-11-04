import { NavigationContainerRef } from '@react-navigation/native'
import { ScreenList } from './ScreenList'

export let navigation: NavigationContainerRef<any> | null = null

export const setNavigation = (n: any) => (navigation = n)

export const goBack = () => navigation?.goBack()

export const navigate = <Name extends keyof ScreenList>(name: Name, props?: ScreenList[Name]) =>
	navigation?.navigate(name, props)

export const reset = <Name extends keyof ScreenList>(
	name: Name,
	props?: ScreenList[Name],
	// @ts-ignore
) => navigation?.reset({ index: 0, routes: [{ name, params: props }] })
