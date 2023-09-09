import express from 'express';
import cors from "cors"
import { signUpRoute } from './Routes/SignUp/SignUp';
import { loginRoute } from './Routes/Login/Login';
import { ReviewRoutes } from "./Routes/Review/ReviewRoutes"
import { Users } from "./Routes/Users/users";
import { GetReviews } from "./Routes/Review/GetReviews"
import { GetTags } from "./Routes/Tags/Tags"
import { getUserToken } from "./Routes/GithubAuth/githubAuth"
import { getGithubUserData } from "./Routes/GithubAuth/githubAuth"
import { GetAuthThirdPartyApi } from "./Routes/ThirdPartyApiAuth"
import { singleUser } from "./Routes/SingleUser/SingleUser"
import { updateUser } from "./Routes/UpdateUser/updateUser"
import { myReveiw } from "./Routes/Review/MyReview"
import { singleReview } from "./Routes/SingleReview/SingleReview"
import { gradeReq } from "./Routes/Grades/grades"

const app = express();
const port = process.env.PORT || 3002;
app.use(cors());
app.use(express.static('uploads'))
app.use(express.json());
app.listen(port, () => console.log(`Server is running on port ${port}`));


app.use('/api/register', signUpRoute)
app.use('/api/login', loginRoute)
app.use("/api/review", ReviewRoutes)
app.use("/api/users", Users)
app.use("/api/all-reviews", GetReviews)
app.use("/api/tags", GetTags)
app.use("/getAccessToken", getUserToken)
app.use("/getGithubUserData", getGithubUserData)
app.use('/api/get-auth', GetAuthThirdPartyApi)
app.use("/api/single-user", singleUser)
app.use("/api/update-user", updateUser)
app.use("/api/user-review", myReveiw)
app.use("/api/single-review", singleReview)
app.use("/api/grade-rate", gradeReq);

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

app.get('/rating', (req, res) => {
    const response = prisma.rating.findMany()

    res.json(response)
})