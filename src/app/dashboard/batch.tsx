import React from "react";
import { format } from "date-fns";
import { EllipsisVertical, Plus, Search, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Modal, ModalTrigger, ModalContent } from "@/components/ui/modal";
import CreateBatch from "@/components/modals/CreateBatch";
import MedicineHistory from "@/components/modals/MedicineHistory";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import TransferOwnership from "@/components/modals/TransferOwnership";

const Batch: React.FC = () => {
	return (
		<>
			<PageTitle title="Batch" header={true} />
			<div className="flex justify-between">
				<Button
					variant="outline"
					className="h-[48px] w-[360px] p-3 flex items-center gap-2"
				>
					<Search strokeWidth={1} />
					<input
						type="text"
						className="bg-transparent w-full focus:outline-none py-1"
						placeholder="Search by batch or medicine id"
					/>
				</Button>

				<Modal>
					<ModalTrigger asChild>
						<Button variant="outline" className="h-[48px]">
							<Plus />
							<p> Create new batch</p>
						</Button>
					</ModalTrigger>
					<ModalContent>
						<CreateBatch />
					</ModalContent>
				</Modal>
			</div>
			<DataTable />
		</>
	);
};

export default Batch;

type Batch = {
	batchId: string;
	medicineId: string;
	quantity: number;
	remainingQuantity: number;
	productionDate: number;
	expiryDate: number;
	isActive: boolean;
};

const defaultData: Batch[] = [
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: true,
	},
	{
		batchId: "B1-PAE012",
		medicineId: "M-PAE02",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: false,
	},
];

const columnHelper = createColumnHelper<Batch>();

const columns = [
	columnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("quantity", {
		header: "Quantity",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Remaining Quantity",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("productionDate", {
		header: "Prod. Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
	}),
	columnHelper.accessor("expiryDate", {
		header: "Expiry Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
	}),
	columnHelper.accessor("isActive", {
		header: "Status",
		cell: (row) => {
			const status = row.getValue() ? "Active" : "Inactive";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-24", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "Active",
						"text-red-800 bg-[#7f1d1d4d]": status === "Inactive",
					})}
				>
					{status}
				</div>
			);
		},
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
	row: Row<Batch>;
};

const DropdownMenuAndDialog: React.FC<DropdownDialogTriggerProp> = ({
	row,
}) => {
	const [showTransfer, setShowTransfer] = React.useState(false);
	const [showHistory, setShowHistory] = React.useState(false);

	function toggleHistory() {
		setShowHistory(!showHistory);
	}
	function toggleTransfer() {
		setShowTransfer(!showTransfer);
	}

	const status = row.getValue("isActive");

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
					<DropdownMenuItem disabled={!status} onClick={toggleTransfer}>
						Transfer ownership
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

			{/* Dialog for transfer */}
			<Dialog open={showTransfer}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Transfer Ownership</DialogTitle>
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
					<TransferOwnership />
					<VisuallyHidden asChild>
						<DialogDescription>
							Transfer ownership of medicine
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>
		</>
	);
};
