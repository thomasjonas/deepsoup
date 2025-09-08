// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from '$lib/auth';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type * as schema from '$lib/server/db/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Session['user'];
			session?: Session['session'];
			db: LibSQLDatabase<typeof schema> | DrizzleD1Database<typeof schema>;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
			};
		}
	}
}

declare module 'simple-datatables' {
	export type {
		DataTableOptions,
		DataTableConfiguration,
		ColumnOption,
		cellType,
		inputCellType,
		dataRowType,
		inputRowType,
		headerCellType,
		inputHeaderCellType,
		TableDataType,
		DataOption,
		renderType,
		nodeType,
		elementNodeType,
		textNodeType,
		cellDataType
	} from 'simple-datatables/dist/dts/datatable';
	export type { SelectableDataRow } from '@flowbite-svelte-plugins/datatable';
	export { DataTable } from 'simple-datatables/dist/dts/datatable';
	export { convertCSV, convertJSON } from 'simple-datatables/dist/dts/convert';
	export { exportCSV, exportJSON, exportSQL, exportTXT } from 'simple-datatables/dist/dts/export';
	export { createElement, isJson, isObject } from 'simple-datatables/dist/dts/helpers';
	export { makeEditable } from 'simple-datatables/dist/dts/editing';
	export { addColumnFilter } from 'simple-datatables/dist/dts/column_filter';
}

export {};
