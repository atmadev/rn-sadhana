import * as SecureStore from 'expo-secure-store'

type SecureKey = 'username' | 'password'

export const saveSecure = (key: SecureKey, value: string) => SecureStore.setItemAsync(key, value)
export const fetchSecure = (key: SecureKey) => SecureStore.getItemAsync(key)
export const deleteSecure = (key: SecureKey) => SecureStore.deleteItemAsync(key)
