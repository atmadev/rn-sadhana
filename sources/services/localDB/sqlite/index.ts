import { PersistentShaped, PrimaryPartialPersistentShaped, ShapeName } from 'types/primitives'
import { AggregateItem, SQLSchema } from './types'
import {
	AggregateQuery,
	DeleteQuery,
	InsertQuery,
	SelectQuery,
	UpdateMultipleQuery,
	UpdateQuery,
} from './queries'
import { setUpSchemaIfNeeded } from './migration'

export const preInitDB = <UsedShapeName extends ShapeName>(
	schema: SQLSchema<UsedShapeName>,
): SQLDB<UsedShapeName> => {
	// console.log(styleLog('bold', '\n💿 Setup DB\n'))

	const shapeNames = Object.keys(schema) as UsedShapeName[]

	const tables = {} as SQLDB<UsedShapeName>['tables']
	for (const shapeName of shapeNames) {
		tables[shapeName] = new Table(shapeName)
	}

	return { tables, table: (name) => tables[name], init: () => setUpSchemaIfNeeded(schema) }
}

export class Table<TableName extends ShapeName, Object = PersistentShaped<TableName>> {
	readonly name: TableName
	constructor(name: TableName) {
		this.name = name
	}

	insert = (...objects: Object[]) => {
		if (objects.length === 0) return
		const query = new InsertQuery(this.name, objects)
		return query.run()
	}

	select = <SelectedColumn extends keyof PersistentShaped<TableName>>(
		...columns: SelectedColumn[] | (keyof PersistentShaped<TableName>)[]
	) => new SelectQuery(this.name, columns as SelectedColumn[])

	aggregate = <Columns extends AggregateItem<PersistentShaped<TableName>>[]>(...columns: Columns) =>
		new AggregateQuery(this.name, columns)

	update = (object: Partial<PersistentShaped<TableName>>) => new UpdateQuery(this.name, object)
	updateMultiple = (objects: PrimaryPartialPersistentShaped<TableName>[]) =>
		new UpdateMultipleQuery(this.name, objects)

	delete = () => new DeleteQuery(this.name)
}

export type SQLDB<ShapeNames extends ShapeName> = {
	table: <SN extends ShapeNames>(table: SN) => Table<SN>
	tables: { [SN in ShapeNames]: Table<SN> }
	init: () => Promise<void>
}
