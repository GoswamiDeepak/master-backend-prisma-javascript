import { checkSchema } from 'express-validator';

export default checkSchema({
    title: {
        trim: true,
        notEmpty: {
            errorMessage: 'title cannot be empty',
        },
    },
    content: {
        notEmpty: {
            errorMessage: 'content cannot be empty',
        },
    },
    image: {
        notEmpty: {
            errorMessage: 'image is required.',
        },
        custom: {
            options: (value, { req }) => {
                if (!req.files) {
                    throw new Error('Image is required.');
                }
                return true;
            },
        },
    },
});
