import * as RN from 'react-native'
import * as GH from 'react-native-gesture-handler'
import { Device } from 'const'

const source = Device.ios ? GH : RN

export const TouchableHighlight = source.TouchableHighlight
export const TouchableOpacity = source.TouchableOpacity
export const TouchableWithoutFeedback = source.TouchableWithoutFeedback
