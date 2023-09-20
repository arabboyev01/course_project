export const clause = (filterName: string, parsedTags: any) => {

    const currentDate = new Date(); 
    let startDate;
    let endDate;
    
    if (filterName === 'today') {
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999); 
    } else if (filterName === 'week') {
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7); 
        endDate = new Date(currentDate);
    } else if (filterName === 'month') {
        startDate = new Date(currentDate);
        startDate.setDate(1); 
        endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 1, 0); 
    }
    
    const whereClause = {
        AND: [
            parsedTags && parsedTags.length > 0 ? { tags: { some: { name: { in: parsedTags } } } } : {},
            startDate && endDate ? { createdAt: { gte: startDate,  lte: endDate } } : {},
        ],
    };

    return whereClause;
}