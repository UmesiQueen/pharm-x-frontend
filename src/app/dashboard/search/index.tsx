import React from "react";
import { EllipsisVertical, Search as SearchIcon, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getFilteredRowModel,
} from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicineHistory from "@/components/modals/MedicineHistory";
import DispenseMedicine from "@/components/modals/DispenseMedicine";
import { cn } from "@/lib/utils";
import type { MedicineDetails, MedicineHolders } from "./types";
import ClippableAddress from "@/components/ClippableAddress";
import { global_ctx } from "@/app/dashboard/_layout";
import { useReadSupplyChainRegistry } from "@/hooks/useReadSupplyChainRegistry";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadMedicineDetails } from "@/hooks/useReadMedicineDetails";

const columnHelper = createColumnHelper<MedicineDetails>();

const columns = [
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
	}),
	columnHelper.accessor("brand", {
		header: "Brand",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Available Stock",
		cell: (row) => <span>{Number(row.getValue())}</span>,
		enableGlobalFilter: false,
	}),
];

const holdersColumnHelper = createColumnHelper<MedicineHolders>();

const holdersColumns = [
	holdersColumnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("holderName", {
		header: "Holder Name",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("holderLocation", {
		header: "Location",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("holderAddress", {
		header: "Wallet Address",
		cell: (row) => <ClippableAddress text={row.getValue()} />,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("availableQuantity", {
		header: "Available Stock",
		cell: (row) => <span>{Number(row.getValue())}</span>,
		enableGlobalFilter: false,
	}),
];

const Search: React.FC = () => {
	const [availableMedicinesData, setAvailableMedicinesData] = React.useState<
		MedicineDetails[] | []
	>([]);
	const [holdersData, setHoldersData] = React.useState<MedicineHolders[] | []>(
		[]
	);
	const [globalFilter, setGlobalFilters] = React.useState<string>("");
	const [isHoldersTab, setIsHoldersTab] = React.useState(false);
	const [medicineExists, setMedicineExists] = React.useState(true);
	const {
		availableMedicines,
		isAvailableMedicinesFetched,
		isAvailableMedicinesLoading,
		getMedicineHolders,
		isHoldersLoading,
		medicineHoldersData,
	} = useReadSupplyChainRegistry();
	const { medicineIds } = useReadMedicineDetails();

	React.useEffect(() => {
		if (!isHoldersLoading && medicineHoldersData.length)
			setHoldersData(medicineHoldersData);
	}, [medicineHoldersData, isHoldersLoading]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isAvailableMedicinesFetched) {
			setAvailableMedicinesData(availableMedicines);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAvailableMedicinesFetched]);

	const table = useReactTable({
		data: availableMedicinesData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onGlobalFilterChange: setGlobalFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
	});

	const holdersTable = useReactTable({
		data: holdersData,
		columns: holdersColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		table.setGlobalFilter(String(value));
		setMedicineExists(true);
	};

	const handleOnSearchClick = () => {
		const result = medicineIds.includes(globalFilter);
		if (result) {
			getMedicineHolders(globalFilter);
		} else {
			setMedicineExists(false);
		}
	};

	return (
		<>
			<PageTitle title="Search Available Stock" header={true} />
			<Tabs
				defaultValue="in"
				onValueChange={(val) => {
					setIsHoldersTab(val === "all");
				}}
			>
				<div className="flex justify-between gap-2 items-center">
					{!isHoldersTab ? (
						<Button
							variant="outline"
							className="h-[48px] w-[360px] p-3 flex items-center gap-2"
						>
							<SearchIcon strokeWidth={1} />
							<input
								type="text"
								onChange={handleChange}
								className="bg-transparent w-full focus:outline-none py-1"
								placeholder="Search by medicine id or name"
							/>
						</Button>
					) : (
						<div>
							<div className="flex gap-2 items-center">
								<Button
									variant="outline"
									className="h-[48px] w-[360px] p-3 flex items-center gap-2"
								>
									<SearchIcon strokeWidth={1} />
									<input
										type="text"
										onChange={handleChange}
										className="bg-transparent w-full focus:outline-none py-1"
										placeholder="Find medicine holders by medicine id"
									/>
								</Button>
								<Button
									className="h-[48px]"
									onClick={handleOnSearchClick}
									loading={isHoldersLoading}
								>
									Search
								</Button>
							</div>
							{!medicineExists && (
								<p className="text-xs text-red-800 pt-1 pl-1">
									Medicine id "{globalFilter}" does not exist
								</p>
							)}
						</div>
					)}

					<TabsList className="*:h-10">
						<TabsTrigger value="in">In stock</TabsTrigger>
						<TabsTrigger value="all">All Holders</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="in">
					<Table className="border-separate border-spacing-y-2">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												className="text-black font-semibold"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{!isAvailableMedicinesLoading ? (
								table.getRowModel().rows?.length ? (
									<>
										{table.getRowModel().rows.map((row) => (
											<TableRow
												key={row.id}
												className="rounded-lg overflow-hidden bg-white hover:bg-[#4d46b412] "
											>
												{row.getVisibleCells().map((cell, index) => (
													<TableCell
														key={cell.id}
														className={cn({
															"rounded-l-lg pl-5": index === 0,
															"rounded-r-lg":
																index === row.getVisibleCells().length,
														})}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
												<TableCell className="rounded-r-lg ">
													<DropdownMenuAndDialog {...row.original} />
												</TableCell>
											</TableRow>
										))}
									</>
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)
							) : (
								Array.from(new Array(4)).map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<TableRow key={index}>
										{table.getVisibleLeafColumns().map((column) => (
											<TableCell key={column.id}>
												<Skeleton className="w-full h-12 rounded-lg" />
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TabsContent>

				<TabsContent value="all">
					<Table className="border-separate border-spacing-y-2">
						<TableHeader>
							{holdersTable.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												className="text-black font-semibold"
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{!isHoldersLoading ? (
								holdersTable.getRowModel().rows?.length ? (
									<>
										{holdersTable.getRowModel().rows.map((row) => (
											<TableRow
												key={row.id}
												className="rounded-lg overflow-hidden bg-white hover:bg-[#4d46b412] h-[51px] p-2 "
											>
												{row.getVisibleCells().map((cell, index) => (
													<TableCell
														key={cell.id}
														className={cn({
															"rounded-l-lg pl-5": index === 0,
															"rounded-r-lg":
																index === row.getVisibleCells().length,
														})}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</TableCell>
												))}
											</TableRow>
										))}
									</>
								) : (
									<TableRow>
										<TableCell
											colSpan={holdersColumns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)
							) : (
								Array.from(new Array(4)).map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<TableRow key={index}>
										{holdersTable.getVisibleLeafColumns().map((column) => (
											<TableCell key={column.id}>
												<Skeleton className="w-full h-12 rounded-lg" />
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</>
	);
};

export default Search;

const DropdownMenuAndDialog: React.FC<MedicineDetails> = (row) => {
	const [showDispense, setShowDispense] = React.useState(false);
	const [showHistory, setShowHistory] = React.useState(false);
	const { userStore } = React.useContext(global_ctx);

	function toggleHistory() {
		setShowHistory(!showHistory);
	}
	function toggleDispense() {
		setShowDispense(!showDispense);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="w-full inline-flex justify-center">
						<Button variant="ghost" size="icon">
							<span className="sr-only">Open menu</span>
							<EllipsisVertical strokeWidth={1} />
						</Button>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className=" w-56 p-2 space-y-1">
					<DropdownMenuItem onClick={toggleHistory}>
						View history
					</DropdownMenuItem>
					{userStore?.role === "Pharmacy" && (
						<DropdownMenuItem onClick={toggleDispense}>
							Dispense medicine
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine history */}
			<Dialog open={showHistory}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Medicine History</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleHistory} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<MedicineHistory {...row} />
					<VisuallyHidden asChild>
						<DialogDescription>
							Detailed life cycle of medicine
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>

			{/* Dialog to dispense */}
			<Dialog open={showDispense}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Dispense Medicine</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleDispense} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<DispenseMedicine props={{ row, onCloseFn: toggleDispense }} />
					<VisuallyHidden asChild>
						<DialogDescription>Dispense medicine to patient</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>
		</>
	);
};
