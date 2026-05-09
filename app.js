import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoute from './src/routes/authRoutes.js';
import reportRoute from './src/routes/reportRoutes.js';
import commentRoute from './src/routes/commentRoutes.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/reports', reportRoute);
app.use('/api/comments', commentRoute);

app.get('/', (req, res) => {
    res.send('api berjalan');
});

app.listen(port, () => {
    console.log(`Server is Running in Port ${port}`);
});