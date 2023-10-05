import express, { Request, Response } from 'express'

const unsupportedType = express.Router()

unsupportedType.get('/', async (req: Request, res: Response) => {
    const contentType = req.get('Content-Type')
    const supportedContentType = 'application/json'

    if (contentType !== supportedContentType) return
    
    res.json({ message: 'Request successfully processed' })
})

export { unsupportedType }