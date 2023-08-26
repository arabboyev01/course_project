import express from 'express';
import cors from "cors"
import { signUpRoute } from './Routes/SignUp/SignUp';
import { loginRoute } from './Routes/Login/Login';
import { ReviewRoutes } from "./Routes/Review/ReviewRoutes"

const app = express();
const port = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use('/api/register', signUpRoute);
app.use('/api/login', loginRoute);
app.use("/api/review", ReviewRoutes);