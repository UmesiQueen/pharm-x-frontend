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
import { v4 as uuid } from "uuid";
import {
	useWriteGlobalEntities,
	type RegisterEntity as RegisterEntityType,
} from "@/hooks/useWriteGlobalEntities";
import type { Address } from "viem";

const FormSchema = z.object({
	license: z
		.string({ required_error: "Field cannot be empty" })
		.trim()
		.toLowerCase(),
	name: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Name must contain at least 2 character(s)" })
		.max(30, { message: "Name cannot contain more than 30 character(s)" })
		.trim()
		.toLowerCase(),
	location: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Location must contain at least 2 character(s)" })
		.max(30, {
			message: "Location cannot contain more than 30 character(s)",
		})
		.trim()
		.toLowerCase(),
	role: z.enum(["Manufacturer", "Supplier", "Pharmacy"], {
		message: "Select a role",
	}),
	entityAddress: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Invalid wallet address" })
		.trim(),
});

type RegisterEntityProps = {
	onCloseFn: () => void;
};

const RegisterEntity: React.FC<RegisterEntityProps> = ({ onCloseFn }) => {
	const { registerEntity } = useWriteGlobalEntities();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			license: undefined,
			name: undefined,
			location: undefined,
			role: undefined,
			entityAddress: undefined,
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		const { role, entityAddress, ...others } = formData;
		let prefix = "NONE";
		let entityRole = 0;

		if (role === "Manufacturer") {
			prefix = "MFG";
			entityRole = 1;
		} else if (role === "Supplier") {
			prefix = "SUP";
			entityRole = 2;
		} else if (role === "Pharmacy") {
			prefix = "PHA";
			entityRole = 3;
		}

		const registrationNumber = `${prefix}-${uuid().slice(0, 4)}`;

		const entityDetails: RegisterEntityType = {
			registrationNumber,
			role: entityRole,
			entityAddress: entityAddress as Address,
			...others,
		};

		try {
			const result = await registerEntity(entityDetails);
			if (result) onCloseFn();
		} catch (err) {
			console.error("Failed to change entity status:", err);
		}
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
							name="license"
							render={({ field }) => (
								<FormItem>
									<FormLabel>License No.</FormLabel>
									<FormControl>
										<Input
											maxLength={35}
											type="text"
											{...field}
											placeholder="L-123456"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
											placeholder="Clinique de L'Occident"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="entityAddress"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Wallet Address</FormLabel>
									<FormControl>
										<Input type="text" {...field} placeholder="0x76ef3..." />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
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
												<SelectItem value="Manufacturer">
													Manufacturer
												</SelectItem>
												<SelectItem value="Supplier">Supplier</SelectItem>
												<SelectItem value="Pharmacy">Pharmacy</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
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
							<Button variant="outline" type="button" onClick={onCloseFn}>
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
