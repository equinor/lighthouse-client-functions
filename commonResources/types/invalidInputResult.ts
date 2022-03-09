export interface InvalidInputResult{
    status: number, 
    body: { 
        message: string,  
        missingKeys?: string[]
    }
}
