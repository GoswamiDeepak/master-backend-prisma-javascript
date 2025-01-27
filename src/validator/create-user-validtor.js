import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        trim: true,
        notEmpty: {
            errorMessage: "Name cannot be empty"
        },
        isLength: {
            options: { max: 191 },
            errorMessage: "Name cannot exceed 191 characters"
        }
    },
    email: {
        trim: true,
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
        isEmail: {
            errorMessage: "Please provide a valid email"
        },
        isLength: {
            options: { max: 191 },
            errorMessage: "Email cannot exceed 191 characters" 
        },
        custom: {
            options: async (value) => {
                const user = await prisma.users.findUnique({
                    where: { email: value }
                });
                if (user) {
                    throw new Error("Email already exists");
                }
                return true;
            }
        }
    },
    password: {
        trim: true,
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters long"
        }
    },
    profile: {
        optional: true,
        isString: {
            errorMessage: "Profile must be a string"
        }
    }
})