import axios from 'axios'
import express, { Request, Response } from 'express'

const getUserToken = express.Router()
const getGithubUserData = express.Router()

const github_client_id = process.env.GITHUB_CLIENT_ID as string
const github_client_secret = process.env.GITHUB_CLIENT_SECRET_KEY as string

getUserToken.get('/', async (req: Request, res: Response) => {

    try {
        const { code } = req.query
        const params = new URLSearchParams({
            client_id: github_client_id,
            client_secret: github_client_secret,
            code: code as string,
        })

        const response = await axios.post('https://github.com/login/oauth/access_token', params, {
            headers: {
                'Accept': 'application/json',
            },
        })
        if (!response) {
            throw new Error(`GitHub OAuth request failed with status ${response}`)
        }

        const data = response.data
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }

})

getGithubUserData.get('/', async (req: Request, res: Response) => {

    const token: string = req.get('Authorization') as string

    axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': token,
        },
    }).then((response) => {
        res.json(response.data)
    }).catch(() => {
        res.status(500).json({ error: 'Internal Server Error' })
    })
})

export { getUserToken, getGithubUserData }
