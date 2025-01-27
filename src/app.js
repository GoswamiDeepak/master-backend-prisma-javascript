import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to Master Backend' });
});

export default app;
