import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Batch } from "@/app/dashboard/batch/types";
import { useWriteSupplyChainRegistry } from "@/hooks/useWriteSupplyChainRegistry";
import type { Address } from "viem";

type TransferOwnershipProps = {
	props: { row: Batch; onCloseFn: () => void };
};

export type TransferDetails = {
	batchId: string;
	entityAddress: Address;
	quantity: number;
};

const TransferOwnership: React.FC<TransferOwnershipProps> = ({
	props: { row, onCloseFn },
}) => {
	const { transferOwnership } = useWriteSupplyChainRegistry();

	const FormSchema = z.object({
		quantity: z.coerce
			.number({
				required_error: "Field cannot be blank",
				invalid_type_error: "Please enter a number",
			})
			.positive({ message: "Please enter a quantity greater than 0" })
			.lt(row?.remainingQuantity + 1, {
				message: `Max. quantity <= ${row?.remainingQuantity}`,
			}),
		recipient: z
			.string({ required_error: "Field cannot be blank" })
			.min(2, { message: "Invalid wallet address" }),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			quantity: undefined,
			recipient: undefined,
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		const { recipient, quantity } = formData;
		const transferDetails: TransferDetails = {
			batchId: row?.batchId,
			entityAddress: recipient as Address,
			quantity,
		};

		try {
			const result = await transferOwnership(transferDetails);
			if (result) onCloseFn();
		} catch (err) {
			console.error("Transfer failed:", err);
		}
	});

	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">Transfer Medicine</h1>
			<hr className="my-4" />

			<div className="space-y-6">
				{/* Details Section */}
				<div>
					<h2 className="mb-2 px-6">Details</h2>
					<div className="px-6 grid grid-cols-2 gap-y-2">
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Batch ID:</p>
							<p>B1-JSJS3</p>
						</div>
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Medicine ID:</p>
							<p>M-JSJS01</p>
						</div>
					</div>
				</div>

				<hr className="my-4" />
				<div className="px-6">
					<Form {...form}>
						<form onSubmit={onSubmit} className="space-y-5">
							<FormField
								control={form.control}
								name="recipient"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Recipient</FormLabel>
										<FormControl>
											<Input
												maxLength={35}
												type="text"
												{...field}
												placeholder="0x76ef3..."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input type="number" {...field} placeholder="0" min={1} />
										</FormControl>
										<FormMessage />
										{form.formState.errors?.quantity?.type !== "too_big" && (
											<FormDescription>
												Max. quantity {"<"}= {row?.remainingQuantity}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>

							<div className="flex justify-end gap-2">
								<Button variant="outline" type="button" onClick={onCloseFn}>
									Cancel
								</Button>
								<Button
									type="submit"
									className="bg-[#4E46B4] hover:bg-[#4d46b497] "
								>
									Transfer
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default TransferOwnership;
