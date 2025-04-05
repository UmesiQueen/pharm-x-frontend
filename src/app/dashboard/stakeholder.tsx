import React from "react";
import { EllipsisVertical, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getFilteredRowModel,
} from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Modal, ModalTrigger, ModalContent } from "@/components/ui/modal";
import RegisterEntity from "@/components/modals/RegisterEntity";
import ClippableAddress from "@/components/ClippableAddress";
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import ConfirmationModal from "@/components/modals/Confirmation";

type Role = "Manufacturer" | "Supplier" | "Pharmacy";

type Entity = {
	name: string;
	location: string;
	regNumber: string;
	regDate: number;
	role: Role;
	status: boolean;
	address: string;
};

const defaultData: Entity[] = [
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: false,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
];

const columnHelper = createColumnHelper<Entity>();

const columns = [
	columnHelper.accessor("regNumber", {
		header: "Reg. Number",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("location", {
		header: "Location",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("role", {
		header: "Role",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (row) => {
			const status = row.getValue() ? "Active" : "Inactive";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-28", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "Active",
						"text-red-800 bg-[#7f1d1d4d]": status === "Inactive",
					})}
				>
					{status}
				</div>
			);
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("address", {
		header: "Wallet Address",
		cell: (row) => <ClippableAddress text={row.getValue()} />,
	}),
];

const Stakeholders: React.FC = () => {
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
			<PageTitle title="Stakeholders" header={true} />
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
						placeholder="Search by reg.no, name or address"
					/>
				</Button>
				<Modal>
					<ModalTrigger asChild>
						<Button variant="outline" className="h-[48px]">
							<Plus />
							<p> Add entity</p>
						</Button>
					</ModalTrigger>
					<ModalContent>
						<RegisterEntity />
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

export default Stakeholders;

const DropdownMenuAndDialog: React.FC<Entity> = ({ regNumber, status }) => {
	const [showStatusModal, setShowStatusModal] = React.useState(false);
	const [showDeleteModal, setShowDeleteModal] = React.useState(false);

	function toggleStatusModal() {
		setShowStatusModal(!showStatusModal);
	}

	function toggleDeleteModal() {
		setShowDeleteModal(!showDeleteModal);
	}

	function handleStatusState() {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		if (status) {
			toast.promise(promise, {
				loading: "Completing transaction...",
				success: () => {
					toggleStatusModal();
					return "Entity deactivated!";
				},
				error: "Error",
			});
		} else {
			toast.promise(promise, {
				loading: "Completing transaction...",
				success: () => {
					toggleStatusModal();
					return "Entity activated!";
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
				return "Entity deleted!";
			},
			error: "Error",
		});
	}

	const confirmationModalValues = {
		approvalModal: {
			title: `${status ? "Deactivate" : "Activate"} entity`,
			onCloseFn: toggleStatusModal,
			onSubmit: handleStatusState,
		},
		deleteModal: {
			title: "Delete entity",
			onCloseFn: toggleDeleteModal,
			onSubmit: handleDeleteMedicine,
		},
	};
	console.log(regNumber, "regNumber");

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
					<DropdownMenuItem onClick={toggleStatusModal}>
						{status ? "Deactivate" : "Activate"} entity
					</DropdownMenuItem>
					<DropdownMenuItem onClick={toggleDeleteModal}>
						<p className="text-red-600">Delete entity</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine approval */}
			<Dialog open={showStatusModal}>
				<DialogContent className="overflow-y-scroll max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
					<VisuallyHidden asChild>
						<DialogTitle>
							{status ? "Disapprove" : "Approve"} Medicine
						</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleStatusModal} asChild>
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
							{status ? "disapproval" : "approval"}
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
