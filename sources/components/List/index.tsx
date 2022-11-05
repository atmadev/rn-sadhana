import React, { FC, PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'mobx-react-lite'
import { createStyles } from 'screens/utils'

import { Section } from './Section'
import { Row } from './Row'
import { Button } from './Button'
import { Switch } from './Switch'

export const List = {
	Scroll: observer(({ children }) => {
		return (
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				{children}
			</ScrollView>
		)
	}) as FC<PropsWithChildren<{}>>,
	Section,
	Row,
	Button,
	Switch,
}

const styles = createStyles({
	container: {},
	contentContainer: { paddingVertical: 10 },
})
