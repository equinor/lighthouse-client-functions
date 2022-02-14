import { Context, HttpRequest } from "@azure/functions";
import { SYSTEM_KEY } from "../constants/constants";
import { systemMessageOutputValidation, systemMessageValidation } from "../utils/validation";
import { appConfigurationClient } from "./appConfigurationClient";

export async function getSystemMessage(context: Context, req: HttpRequest) {
    try{
        const result = await appConfigurationClient.getConfigurationSetting({key: SYSTEM_KEY})
        const systemMessage =  systemMessageOutputValidation(result.value)
        
        context.res = {
            // status: result.statusCode,
            body: systemMessage
        };
    } catch (error) {
        context.res = {
            status: 500, 
            body: { message: error}
        };
    }
}

export async function postSystemMessage(context: Context, req: HttpRequest) {
    try{
        const value = systemMessageValidation(req.body)
        if (typeof value !== "string") throw value;
            const result = await appConfigurationClient.setConfigurationSetting( {key: SYSTEM_KEY,  value })
            
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { status: "done", result }
        };
    } catch (error) {
        context.res = {
            ...error
        };
    }
}