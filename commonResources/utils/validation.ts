import { SystemMessage } from "../types/systemMessage"

export function systemMessageValidation(systemMessage?: SystemMessage): {  status: number , body: { message: string,  missingKeys?: string[]}} | string {
    const keys = ["message", "type", "fromDate", "toDate"]
    if (!systemMessage) {
        return {  
            status: 422,  
            body: {message: "No valid Body provided",  
            missingKeys: keys}
        }
    }
    const missingKeys: string[] = []
    keys.map(key => {
        if(!Object.keys(systemMessage).includes(key)) {
            missingKeys.push(key) 
        }
    })

    if (missingKeys.length > 0) {
        return {  status: 422 , body: { message: "Key missing in body",  missingKeys} }
    }

    if (isValidDate(systemMessage.fromDate)){
        return {  status: 422 , body: { message: "invalidDate fromDate" } }
    }

    if (isValidDate(systemMessage.toDate)){
        return {  status: 422 , body: { message: "invalidDate toDate" } }
    }

    return JSON.stringify(systemMessage);
}


export function systemMessageOutputValidation(data?: string): SystemMessage | undefined {


    try{
        const systemMessage = JSON.parse(data)
        const currentDate = new Date().getDate()
        const toDate = new Date(systemMessage?.toDate).getDate();
        const fromDate = new Date(systemMessage?.toDate).getDate();
        if (currentDate <= fromDate && toDate >= currentDate) {
            return systemMessage;
        }
    
        return;
    } catch {
        return;
    }


}



function isValidDate(date: string): boolean {
    return date === "" || (Date.parse(date).toString() === "NaN")
}


export function isValidEnvironment(id: string): boolean {
    switch (id) {
      case 'prod':
      case 'dev':
      case 'test':
        return true;
      default:
        return false;
    }
  }

