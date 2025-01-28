import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        trim: true,
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isEmail: {
            errorMessage: 'Please provide a valid email',
        },
        isLength: {
            options: { max: 191 },
            errorMessage: 'Email cannot exceed 191 characters',
        },
    },
    password: {
        trim: true,
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
    },
});
