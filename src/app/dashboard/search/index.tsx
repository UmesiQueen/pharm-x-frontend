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
import type { MedicineDetails } from "./types";
import type { Medicine } from "@/app/dashboard/medicine/types";
import ClippableAddress from "@/components/ClippableAddress";
import { global_ctx } from "@/app/dashboard/_layout";

const defaultInStockData: MedicineDetails[] = [
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: true,
	},
	{
		batchId: "B1-PAE012",
		medicineId: "M-PAE02",
		name: "Panadol",
		brand: "Exzol",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: false,
	},
];

const columnHelper = createColumnHelper<MedicineDetails>();

const columns = [
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("brand", {
		header: "Brand",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Available Stock",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
];

type PharmacyStock = Pick<Medicine, "name" | "brand" | "medicineId"> & {
	batchId: string;
	pharmacyAddress: string;
	pharmacyName: string;
	pharmacyLocation: string;
	availableQuantity: number;
};

const defaultAllHoldersData: PharmacyStock[] = [
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		pharmacyName: "Clinic A",
		pharmacyLocation: "Location A",
		pharmacyAddress: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		availableQuantity: 300,
	},
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		pharmacyName: "Clinic B",
		pharmacyLocation: "Location B",
		pharmacyAddress: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		availableQuantity: 300,
	},
];

const holdersColumnHelper = createColumnHelper<PharmacyStock>();

const holdersColumns = [
	holdersColumnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	holdersColumnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	holdersColumnHelper.accessor("pharmacyName", {
		header: "Pharmacy",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("pharmacyLocation", {
		header: "Location",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("pharmacyAddress", {
		header: "Wallet Address",
		cell: (row) => <ClippableAddress text={row.getValue()} />,
		enableGlobalFilter: false,
	}),
	holdersColumnHelper.accessor("availableQuantity", {
		header: "Available Stock",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
];

const Search: React.FC = () => {
	// const [data, setData] = React.useState(defaultInStockData);
	const [globalFilter, setGlobalFilters] = React.useState("");

	const table = useReactTable({
		data: defaultInStockData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onGlobalFilterChange: setGlobalFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
	});

	const holdersTable = useReactTable({
		data: defaultAllHoldersData,
		columns: holdersColumns,
		getCoreRowModel: getCoreRowModel(),
		onGlobalFilterChange: setGlobalFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		table.setGlobalFilter(String(value));
	};

	return (
		<>
			<PageTitle title="Search Available Stock" header={true} />
			<Tabs defaultValue="in">
				<div className="flex justify-between gap-2 items-center">
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
							{table.getRowModel().rows?.length ? (
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
							{holdersTable.getRowModel().rows?.length ? (
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
