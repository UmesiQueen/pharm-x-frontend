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
import { useModal } from "@/components/ui/modal";
import { toast } from "sonner";

const formSchema = z.object({
	name: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Name must contain at least 2 character(s)" })
		.max(30, { message: "Name cannot contain more than 30 character(s)" }),
	location: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Location must contain at least 2 character(s)" })
		.max(30, {
			message: "Location cannot contain more than 30 character(s)",
		}),
	role: z.enum(["manufacturer", "supplier", "pharmacy"], {
		message: "Select a role",
	}),
	wallet: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Invalid wallet address" }),
});

const RegisterEntity: React.FC = () => {
	const { closeModal } = useModal();
	const form = useForm({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			location: "",
			role: undefined,
			wallet: "",
		},
	});

	const onSubmit = form.handleSubmit((formData) => {
		console.log(formData, "formData");
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		toast.promise(promise, {
			loading: "Creating...",
			success: () => {
				closeModal();
				return "New entity has been created";
			},
			error: "Error",
		});
	});

	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">New entity</h1>
			<hr className="my-4" />
			<div className="px-6">
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											maxLength={35}
											type="text"
											{...field}
											placeholder="Kelloggs"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="wallet"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Wallet Address</FormLabel>
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

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input
											maxLength={35}
											type="text"
											{...field}
											placeholder="Flic en flac"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button variant="outline" type="button" onClick={closeModal}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-[#4E46B4] hover:bg-[#4d46b497] "
							>
								Create
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

// Name, location, role, license

export default RegisterEntity;
