<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { createSvelteTable } from './data-table/data-table.svelte';
	import FlexRender from './data-table/flex-render.svelte';

	let {
		data = [],
		columns = [],
		onRowClick
	}: { data: any[]; columns: ColumnDef<any>[]; onRowClick: (row: Row<any>) => void } = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		// onPaginationChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		pagination = updater(pagination);
		// 	} else {
		// 		pagination = updater;
		// 	}
		// },
		onSortingChange: (updater: any) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		}
		// onColumnFiltersChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		columnFilters = updater(columnFilters);
		// 	} else {
		// 		columnFilters = updater;
		// 	}
		// },
		// onColumnVisibilityChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		columnVisibility = updater(columnVisibility);
		// 	} else {
		// 		columnVisibility = updater;
		// 	}
		// },
		// onRowSelectionChange: (updater) => {
		// 	if (typeof updater === 'function') {
		// 		rowSelection = updater(rowSelection);
		// 	} else {
		// 		rowSelection = updater;
		// 	}
		// }
	});
</script>

<div class="w-full">
	<div class="flex items-center py-4">
		<!-- <Input
			placeholder="Filter emails..."
			value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
			oninput={(e) => table.getColumn('email')?.setFilterValue(e.currentTarget.value)}
			onchange={(e) => {
				table.getColumn('email')?.setFilterValue(e.currentTarget.value);
			}}
			class="max-w-sm"
		/>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto">
						Columns <ChevronDownIcon class="ml-2 size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root> -->
	</div>
	<div>
		<Table>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<TableHead>
					{#each headerGroup.headers as header (header.id)}
						<TableHeadCell>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</TableHeadCell>
					{/each}
				</TableHead>
			{/each}

			<TableBody>
				{#each table.getRowModel().rows as row (row.id)}
					<TableBodyRow onclick={() => onRowClick(row)} class="cursor-pointer hover:bg-gray-50">
						<!-- <Table.Row data-state={row.getIsSelected() && 'selected'}> -->
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableBodyCell
								><FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/></TableBodyCell
							>
							<!-- <Table.Cell class="[&:has([role=checkbox])]:pl-3">
								
							</Table.Cell> -->
						{/each}
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length} class="h-24 text-center"
							>No results.</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<div class="flex items-center justify-end space-x-2 pt-4">
		<!-- <div class="text-muted-foreground flex-1 text-sm">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div> -->
		<!-- <div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div> -->
	</div>
</div>
