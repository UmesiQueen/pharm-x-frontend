import React from "react";
import { format } from "date-fns";
import {
	EllipsisVertical,
	Plus,
	Search,
	SquareArrowOutUpRight,
	X,
} from "lucide-react";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
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
import RegisterMedicine from "@/components/modals/RegisterMedicine";
import ClippableAddress from "@/components/ClippableAddress";
import type { Medicine as MedicineType } from "@/app/dashboard/types";
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import ConfirmationModal from "@/components/modals/Confirmation";

const defaultData: MedicineType[] = [
	{
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		regDate: 1743310732,
		manufacturer: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		manufacturerId: "MFG-201",
		approved: true,
	},
	{
		medicineId: "M-PAE02",
		name: "Panadol",
		brand: "Exzol",
		regDate: 1743310732,
		manufacturer: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		manufacturerId: "MFG-201",
		approved: false,
	},
];

const columnHelper = createColumnHelper<MedicineType>();

const columns = [
	columnHelper.accessor("medicineId", {
		header: "Med. Id",
		cell: (row) => <span>{row.getValue()}</span>,
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
	columnHelper.accessor("regDate", {
		header: "Reg. Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("approved", {
		header: "Approved",
		cell: (row) => {
			const status = row.getValue() ? "True" : "False";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-16", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "True",
						"text-red-800 bg-[#7f1d1d4d]": status === "False",
					})}
				>
					{status}
				</div>
			);
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("manufacturer", {
		header: "Mfg. Address",
		cell: (row) => <ClippableAddress text={row.getValue()} />,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("manufacturerId", {
		header: "Mfg. Id",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
];

const Medicine: React.FC = () => {
	// const [data, setData] = React.useState(defaultData);
	const [globalFilter, setGlobalFilters] = React.useState("");

	const table = useReactTable({
		data: defaultData,
		columns,
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
			<PageTitle title="Medicine" header={true} />
			<div className="flex justify-between">
				<Button
					variant="outline"
					className="h-[48px] w-[360px] p-3 flex items-center gap-2"
				>
					<Search strokeWidth={1} />
					<input
						type="text"
						onChange={handleChange}
						className="bg-transparent w-full focus:outline-none py-1"
						placeholder="Search by medicine id or name"
					/>
				</Button>
				<Modal>
					<ModalTrigger asChild>
						<Button variant="outline" className="h-[48px]">
							<Plus />
							<p> Register medicine</p>
						</Button>
					</ModalTrigger>
					<ModalContent>
						<RegisterMedicine />
					</ModalContent>
				</Modal>
			</div>
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
										<DropdownMenuAndDialog {...row.original} />
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

export default Medicine;

const DropdownMenuAndDialog: React.FC<MedicineType> = ({
	medicineId,
	approved,
}) => {
	const [showApprovalModal, setShowApprovalModal] = React.useState(false);
	const [showDeleteModal, setShowDeleteModal] = React.useState(false);

	function toggleApprovalModal() {
		setShowApprovalModal(!showApprovalModal);
	}

	function toggleDeleteModal() {
		setShowDeleteModal(!showDeleteModal);
	}

	function handleApprovalState() {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		if (approved) {
			toast.promise(promise, {
				loading: "Completing transaction...",
				success: () => {
					toggleApprovalModal();
					return "Medicine disapproved!";
				},
				error: "Error",
			});
		} else {
			toast.promise(promise, {
				loading: "Completing transaction...",
				success: () => {
					toggleApprovalModal();
					return "Medicine approved!";
				},
				error: "Error",
			});
		}
	}

	function handleDeleteMedicine() {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		toast.promise(promise, {
			loading: "Deleting...",
			success: () => {
				toggleDeleteModal();
				return "Medicine deleted!";
			},
			error: "Error",
		});
	}

	const confirmationModalValues = {
		approvalModal: {
			title: `${approved ? "Disapprove" : "Approve"} medicine`,
			onCloseFn: toggleApprovalModal,
			onSubmit: handleApprovalState,
		},
		deleteModal: {
			title: "Delete medicine",
			onCloseFn: toggleDeleteModal,
			onSubmit: handleDeleteMedicine,
		},
	};
	console.log(medicineId, "Medicine Id");

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
					<DropdownMenuItem onClick={toggleApprovalModal}>
						{approved ? "Disapprove" : "Approve"} medicine
					</DropdownMenuItem>
					<DropdownMenuItem onClick={toggleDeleteModal}>
						<p className="text-red-600">Delete medicine</p>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<div className="inline-flex w-full justify-between items-center text-blue-600">
							<p>View on block explorer</p>
							<SquareArrowOutUpRight
								strokeWidth={1}
								size={18}
								color="#2563eb"
							/>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine approval */}
			<Dialog open={showApprovalModal}>
				<DialogContent className="overflow-y-scroll max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
					<VisuallyHidden asChild>
						<DialogTitle>
							{approved ? "Disapprove" : "Approve"} Medicine
						</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleApprovalModal} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<ConfirmationModal {...confirmationModalValues.approvalModal} />
					<VisuallyHidden asChild>
						<DialogDescription>
							Confirmation modal for medicine{" "}
							{approved ? "disapproval" : "approval"}
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>

			{/* Dialog for deletion */}
			<Dialog open={showDeleteModal}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Delete Medicine</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleDeleteModal} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<ConfirmationModal {...confirmationModalValues.deleteModal} />
					<VisuallyHidden asChild>
						<DialogDescription>Delete medicine</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>
		</>
	);
};
