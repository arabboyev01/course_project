import axios from "axios"
import express, { Request, Response } from 'express';

const getUserToken = express.Router();
const getGithubUserData = express.Router();
const GITHUB_CLIENT_ID = "aa74f754bd9f3616aaa2"
const GITHUB_CLIENT_SECRET_KEY = "98c91f26f587fb6ea747300ad5db871a44aaff75"

getUserToken.get('/', async (req: Request, res: Response) => {

    try {
        const { code } = req.query;
        const params = new URLSearchParams({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET_KEY,
            code: code as string,
        });

        const response = await axios.post('https://github.com/login/oauth/access_token', params, {
            headers: {
                'Accept': 'application/json',
            },
        });
        // @ts-ignore
        if (!response?.status === 200) {
            throw new Error(`GitHub OAuth request failed with status ${response.status}`);
        }

        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

getGithubUserData.get('/', async (req: Request, res: Response) => {

    const token: any = req.get("Authorization");

    axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': token,
        },
    }).then((response) => {
        res.json(response.data);
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

export { getUserToken, getGithubUserData };
