import express from 'express';
import cors from "cors"
import helmet from "helmet"
import { signUpRoute } from './Routes/SignUp/SignUp';
import { loginRoute } from './Routes/Login/Login';
import { ReviewRoutes } from "./Routes/Review/ReviewRoutes"
import { users } from "./Routes/Users/users";
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
import { likeReq } from "./Routes/Likes/Likes";
import { commentReq } from "./Routes/Comments/comments"
import { getcomment } from "./Routes/Comments/getComents"
import { SearchReq } from "./Routes/Search/search"
import { updateUserImage } from "./Routes/UpdateImage/updateImage"
import { removeReview } from "./Routes/Remove/RemoveReview"
import { udateReveiwImage } from "./Routes/UpdateImage/updateReviewImage"
import { updateReview } from "./Routes/UpdateReview/updateReview"
import { highRate } from "./Routes/Review/HighRate" 
import { singleUserLike } from "./Routes/Likes/SinglUserLike/singleUserLike"
import { appConfig } from "./appConfig"

const app = express();
const port = process.env.PORT || 3002;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', appConfig().origins);
    res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(cors());

app.use(express.json());
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use('/api/register', signUpRoute)
app.use('/api/login', loginRoute)
app.use("/api/review", ReviewRoutes)
app.use("/api/users", users)
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
app.use("/api/likes", likeReq)
app.use("/api/comments", commentReq)
app.use("/api/all-comments", getcomment)
app.use("/api/reviews/advanced-search", SearchReq)
app.use("/api/update-image", updateUserImage)
app.use("/api/update-image-review", udateReveiwImage)
app.use('/api/delete-review', removeReview)
app.use('/api/review-update', updateReview)
app.use('/api/high-rate-review', highRate)
app.use('/api/single-user-like', singleUserLike)