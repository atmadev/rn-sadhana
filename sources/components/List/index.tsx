import React, { FC } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'

import { Section } from './Section'
import { Row } from './Row'
import { Button } from './Button'
import { Switch } from './Switch'
import { Input } from './Input'
import { store } from 'store'

export const List = {
	Scroll: observer((props) => {
		return (
			<ScrollView
				{...props}
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
			/>
		)
	}) as FC<ScrollViewProps>,
	Section,
	Row,
	Button,
	Switch,
	Input,
}

const styles = createStyles({
	container: () => ({ backgroundColor: store.theme.background2 }),
	contentContainer: { paddingVertical: 10 },
})
