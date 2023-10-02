import { Request } from 'express'

function GetQueryValues(req: Request){

    const filterName: string = req.query.filterName as string
    const selectedTags: string = req.query.selectedTags as string
    const sortName: string = req.query.sortName as string
    const page: string = req.query.page as string
    const pageSize: string = req.query.pageSize as string

    return {
        filterName,
        selectedTags,
        sortName,
        page,
        pageSize
    }
}

export { GetQueryValues }