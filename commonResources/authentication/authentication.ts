
import { HttpRequest } from "@azure/functions";
import { ConfidentialClientApplication, LogLevel } from "@azure/msal-node";
import jwt_decode from "jwt-decode";


const config = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        }
    }
};

export const confidentialClientApplication  = new ConfidentialClientApplication(config);

export async function isAuthenticated( request: HttpRequest) {

    const token = request.headers["authorization"]?.replace("Bearer", "");
    if (!token) {
        const error = new Error("No authorization token provided")
        throw {
            status: 401, 
            body: { message: error.message },
        };
    }
    
    try {
        const decoded = jwt_decode(token);
        if (JSON.stringify(decoded["aud"]).includes(process.env["AZURE_CLIENT_ID"]) && decoded["aud"]  !== "") {
            return request
            
        } else {
            const error = new Error("Invalid scope")
        throw {
            status: 401, 
            body: { message: error.message },
        };
        }
    } catch (error) {
        console.log("token ",error )
        throw  error
    }
   
 


}

