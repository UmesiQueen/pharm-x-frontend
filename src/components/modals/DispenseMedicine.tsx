import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Batch } from "@/app/dashboard/batch/types";
import { useWriteSupplyChainRegistry } from "@/hooks/useWriteSupplyChainRegistry";

type DispenseMedicineProps = {
	props: { row: Batch; onCloseFn: () => void };
};

export type DispenseDetails = {
	batchId: string;
	quantity: number;
	patientId: string;
};

const DispenseMedicine: React.FC<DispenseMedicineProps> = ({
	props: { row, onCloseFn },
}) => {
	const { dispenseMedicine } = useWriteSupplyChainRegistry();

	const FormSchema = z.object({
		quantity: z.coerce
			.number({
				required_error: "Field cannot be empty",
				invalid_type_error: "Please enter a number",
			})
			.positive({ message: "Please enter a quantity greater than 0" })
			.lt(row?.remainingQuantity + 1, {
				message: `Max. quantity <= ${row?.remainingQuantity}`,
			}),
		patientId: z
			.string({ required_error: "Field cannot be empty" })
			.min(2, { message: "Invalid patient id" }),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			quantity: undefined,
			patientId: "",
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		const dispenseDetails: DispenseDetails = {
			batchId: row?.batchId,
			...formData,
		};

		try {
			const result = await dispenseMedicine(dispenseDetails);
			if (result) onCloseFn();
		} catch (err) {
			console.error("Failed to dispense medicine:", err);
		}
	});

	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">Dispense Medicine</h1>
			<hr className="my-4" />

			<div className="space-y-6">
				{/* Details Section */}
				<div>
					<h2 className="mb-2 px-6">Details</h2>
					<div className="px-6 grid grid-cols-2 gap-y-2">
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Batch ID:</p>
							<p>{row?.batchId}</p>
						</div>
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Medicine ID:</p>
							<p>{row?.medicineId}</p>
						</div>
					</div>
				</div>

				<hr className="my-4" />
				<div className="px-6">
					<Form {...form}>
						<form onSubmit={onSubmit} className="space-y-5">
							<div className="flex gap-4 *:w-full *:flex-grow">
								<FormField
									control={form.control}
									name="patientId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Patient Id</FormLabel>
											<FormControl>
												<Input
													maxLength={35}
													type="text"
													{...field}
													placeholder="P-0123"
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
												<Input
													type="number"
													{...field}
													placeholder="0"
													min={1}
												/>
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
							</div>

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

export default DispenseMedicine;
