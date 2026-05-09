import express from 'express';
import cors from 'cors';

import authRoute from './src/routes/authRoutes.js';
import reportRoute from './src/routes/reportRoutes.js';
import commentRoute from './src/routes/commentRoutes.js';
import userRoute from './src/routes/userRoutes.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Daftarkan Routes
app.use('/api/auth', authRoute);
app.use('/api/reports', reportRoute);
app.use('/api/comments', commentRoute);
app.use('/api/users', userRoute);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});