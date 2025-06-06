import React from "react";
import { EllipsisVertical, Plus, Search, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import PageTitle from "@/components/PageTitle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import RegisterEntity from "@/components/modals/RegisterEntity";
import ClippableAddress from "@/components/ClippableAddress";
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmationModal from "@/components/modals/Confirmation";
import { useReadGlobalEntities } from "@/hooks/useReadGlobalEntities";
import { Skeleton } from "@/components/ui/skeleton";
import type { Entity } from "./types";
import { useWriteGlobalEntities } from "@/hooks/useWriteGlobalEntities";
import { global_ctx } from "@/app/dashboard/_layout";

const columnHelper = createColumnHelper<Entity>();

const columns = [
	columnHelper.accessor("regNumber", {
		header: "Reg. No.",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("license", {
		header: "License No.",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
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
					className={cn("capitalize rounded-[60px] text-center py-1 w-24", {
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
	const [data, setData] = React.useState<Entity[] | []>([]);
	const [globalFilter, setGlobalFilters] = React.useState("");
	const {
		entityDetails,
		isGlobalEntitiesFetched,
		isAllEntityDetailsLoading,
		isEntityDetailsRefetching,
	} = useReadGlobalEntities();
	const { userStore } = React.useContext(global_ctx);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isGlobalEntitiesFetched && !isEntityDetailsRefetching)
			setData(entityDetails);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isGlobalEntitiesFetched, isEntityDetailsRefetching]);

	const table = useReactTable({
		data,
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
				{userStore?.role === "Regulator" && <RegisterEntityButton />}
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
					{!isAllEntityDetailsLoading ? (
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
										{userStore?.role === "Regulator" && (
											<TableCell className="rounded-r-lg ">
												<DropdownMenuAndDialog {...row.original} />
											</TableCell>
										)}
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
		</>
	);
};

export default Stakeholders;

const DropdownMenuAndDialog: React.FC<Entity> = ({ address, status }) => {
	const [showStatusModal, setShowStatusModal] = React.useState(false);
	const [showDeleteModal, setShowDeleteModal] = React.useState(false);
	const { activateEntity, deactivateEntity, isPending } =
		useWriteGlobalEntities();

	function closeStatusModal() {
		setShowStatusModal(false);
	}

	function closeDeleteModal() {
		setShowDeleteModal(false);
	}

	function handleStatusState() {
		if (status) deactivateEntity(address, closeStatusModal);
		else activateEntity(address, closeStatusModal);
	}

	function handleDeleteMedicine() {
		// do stuff
	}

	const confirmationModalValues = {
		approvalModal: {
			title: `${status ? "Deactivate" : "Activate"} entity`,
			onCloseFn: closeStatusModal,
			onSubmit: handleStatusState,
			isPending,
		},
		deleteModal: {
			title: "Delete entity",
			onCloseFn: closeDeleteModal,
			onSubmit: handleDeleteMedicine,
			isPending,
		},
	};

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
					<DropdownMenuItem onClick={() => setShowStatusModal(true)}>
						{status ? "Deactivate" : "Activate"} entity
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setShowDeleteModal(true)}
						disabled={true}
					>
						<p className="text-red-600">Delete entity</p>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine approval */}
			<Dialog open={showStatusModal}>
				<DialogContent className="w-[400px]">
					<VisuallyHidden asChild>
						<DialogTitle>
							{status ? "Disapprove" : "Approve"} Medicine
						</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={closeStatusModal} asChild>
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
				<DialogContent className="w-[400px]">
					<VisuallyHidden asChild>
						<DialogTitle>Delete Medicine</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={closeDeleteModal} asChild>
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

const RegisterEntityButton: React.FC = () => {
	const [showDialog, setShowDialog] = React.useState(false);

	function closeDialog() {
		setShowDialog(false);
	}

	return (
		<Dialog open={showDialog}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="h-[48px]"
					onClick={() => setShowDialog(true)}
				>
					<Plus />
					<p> Add entity</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<VisuallyHidden asChild>
					<DialogTitle>Register Entity</DialogTitle>
				</VisuallyHidden>
				<DialogClose onClick={closeDialog} asChild>
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-2 right-2 z-20 "
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</Button>
				</DialogClose>
				<RegisterEntity onCloseFn={closeDialog} />
				<VisuallyHidden asChild>
					<DialogDescription>Add entity</DialogDescription>
				</VisuallyHidden>
			</DialogContent>
		</Dialog>
	);
};
