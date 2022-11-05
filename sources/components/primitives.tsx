import { TouchableHighlight as RNTouchableHighlight } from 'react-native'

import { TouchableHighlight as GHTouchableHighlight } from 'react-native-gesture-handler'
import { Device } from 'const'

export const TouchableHighlight = Device.ios ? GHTouchableHighlight : RNTouchableHighlight
