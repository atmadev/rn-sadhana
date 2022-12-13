import { createStyles } from 'screens/utils'
import { store } from 'store'

export const globalStyles = createStyles({
	emptyListDummyText: () => ({
		textAlign: 'center',
		fontSize: 20,
		color: store.theme.text2,
		marginTop: 47,
		marginHorizontal: 16,
	}),
	row: { flexDirection: 'row' },
	barButton: {
		height: 44,
		minWidth: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
