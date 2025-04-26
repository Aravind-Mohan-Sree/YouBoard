import * as z from "zod";

// zod schemas for validation
const validationSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Email is required.")
    .regex(/^\S*$/, "Email can't include space.")
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Invalid email format."),

  password: z
    .string()
    .trim()
    .nonempty("Password is required.")
    .min(8, "Password minimum length is 8.")
    .max(30, "Password maximum length is 30.")
    .regex(/^\S*$/, "Password can't include space.")
    .regex(/\d/, "Password must include a number.")
    .regex(/[^\w\s]/, "Password must include a special character.")
    .regex(/(?=.*[A-Z])/, "Password must include an uppercase character.")
    .regex(/(?=.*[a-z])/, "Password must include a lowercase character.")
    .optional(),

  name: z
    .string()
    .trim()
    .nonempty("Name is required.")
    .regex(/^((?!\s{2,}).)*$/, "Name can't include consecutive space.")
    .regex(/^\D*$/, "Name can't include numbers.")
    .regex(/^[a-zA-Z0-9 ]*$/, "Name can't include special characters.")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length >= 3, {
      message: "Name minimum length is 3.",
    })
    .refine((val) => val.length <= 16, {
      message: "Name maximum length is 16.",
    }),
});

export default validationSchema;
