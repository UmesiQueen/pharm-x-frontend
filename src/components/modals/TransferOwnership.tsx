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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Batch } from "@/app/dashboard/types";

type DispenseMedicineProps = {
	props: { row: Batch; onCloseFn: () => void };
};

const TransferOwnership: React.FC<DispenseMedicineProps> = ({
	props: { row, onCloseFn },
}) => {
	type FormValues = {
		quantity: number;
		role: "manufacturer" | "supplier" | "pharmacy";
		recipient: string;
	};

	const formSchema = z.object({
		quantity: z.coerce
			.number({
				required_error: "Field cannot be blank",
				invalid_type_error: "Please enter a number",
			})
			.positive({ message: "Please enter a quantity greater than 0" })
			.lt(row?.remainingQuantity + 1, {
				message: `Max. quantity <= ${row?.remainingQuantity}`,
			}),
		role: z.enum(["manufacturer", "supplier", "pharmacy"], {
			message: "Please select a role",
		}),
		recipient: z
			.string({ required_error: "Field cannot be blank" })
			.min(2, { message: "Invalid wallet address" }),
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			quantity: undefined,
			role: undefined,
			recipient: "",
		},
	});

	const onSubmit = form.handleSubmit((formData) => {
		console.log(formData, "formData");
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		toast.promise(promise, {
			loading: "Completing transaction...",
			success: () => {
				onCloseFn();
				return "Transaction completed successfully";
			},
			error: "Error",
		});
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
								name="role"
								render={({ field }) => {
									console.log(field);
									return (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent className="font-space-grotesk">
													<SelectGroup>
														<SelectItem value="manufacturer">
															Manufacturer
														</SelectItem>
														<SelectItem value="supplier">Supplier</SelectItem>
														<SelectItem value="pharmacy">Pharmacy</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									);
								}}
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
