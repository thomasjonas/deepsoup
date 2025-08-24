// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from '$lib/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Session['user'];
			session?: Session['session'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
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
