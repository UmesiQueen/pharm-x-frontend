import React from "react";
import { EllipsisVertical, Search as SearchIcon, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	type Row,
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
import MedicineHistory from "@/components/modals/MedicineHistory";
import DispenseMedicine from "@/components/modals/DispenseMedicine";
import { cn } from "@/lib/utils";

const Search: React.FC = () => {
	return (
		<>
			<PageTitle title="Search Available Stock" header={true} />
			<div className="flex justify-between">
				<Button
					variant="outline"
					className="h-[48px] w-[360px] p-3 flex items-center gap-2"
				>
					<SearchIcon strokeWidth={1} />
					<input
						type="text"
						className="bg-transparent w-full focus:outline-none py-1"
						placeholder="Search by medicine id or name"
					/>
				</Button>
			</div>
			<DataTable />
		</>
	);
};

export default Search;

type AvailableMedicine = {
	batchId: string;
	medicineId: string;
	name: string;
	brand: string;
	remainingQuantity: number;
	expiryDate: number;
	isActive: boolean;
};

const defaultData: AvailableMedicine[] = [
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		remainingQuantity: 300,
		expiryDate: 1743310732,
		isActive: true,
	},
	{
		batchId: "B1-PAE012",
		medicineId: "M-PAE02",
		name: "Panadol",
		brand: "Exzol",
		remainingQuantity: 300,
		expiryDate: 1743310732,
		isActive: false,
	},
];

const columnHelper = createColumnHelper<AvailableMedicine>();

const columns = [
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("brand", {
		header: "Brand",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Available Stock",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
];

const DataTable: React.FC = () => {
	// const [data, setData] = React.useState(defaultData);

	const table = useReactTable({
		data: defaultData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
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
												"rounded-r-lg": index === row.getVisibleCells().length,
											})}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
									<TableCell className="rounded-r-lg ">
										<DropdownMenuAndDialog row={row} />
									</TableCell>
								</TableRow>
							))}
						</>
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</>
	);
};

type DropdownDialogTriggerProp = {
	row?: Row<AvailableMedicine>;
};

const DropdownMenuAndDialog: React.FC<DropdownDialogTriggerProp> = () => {
	const [showTransfer, setShowTransfer] = React.useState(false);
	const [showHistory, setShowHistory] = React.useState(false);

	function toggleHistory() {
		setShowHistory(!showHistory);
	}
	function toggleTransfer() {
		setShowTransfer(!showTransfer);
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
					<DropdownMenuItem onClick={toggleTransfer}>
						Dispense medicine
					</DropdownMenuItem>
					<DropdownMenuItem onClick={toggleHistory}>
						View history
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine history */}
			<Dialog open={showHistory}>
				<DialogContent className="overflow-y-scroll max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
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
					<MedicineHistory />
					<VisuallyHidden asChild>
						<DialogDescription>
							Detailed life cycle of medicine
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>

			{/* Dialog to dispense */}
			<Dialog open={showTransfer}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Dispense Medicine</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleTransfer} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<DispenseMedicine />
					<VisuallyHidden asChild>
						<DialogDescription>Dispense medicine to patient</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>
		</>
	);
};
