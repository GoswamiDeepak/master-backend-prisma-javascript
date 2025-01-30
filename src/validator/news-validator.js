import { checkSchema } from 'express-validator';

export default checkSchema({
    title: {
        trim: true,
        notEmpty: {
            errorMessage: 'Title cannot be empty',
        },
        isLength: {
            options: { max: 200 },
            errorMessage: 'Title cannot exceed 200 characters',
        },
    },
    content: {
        trim: true,
        notEmpty: {
            errorMessage: 'Content cannot be empty',
        },
    },
    image: {
        // notEmpty: {
        //     errorMessage: 'image is required.',
        // },
        custom: {
            options: (value, { req }) => {
                if (!req.file) {
                    throw new Error('Image is required. validation failed!');
                }
                return true;
            },
        },
    },
});
