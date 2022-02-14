import { ConfidentialClientApplication, LogLevel } from "@azure/msal-node";

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

export const cca = new ConfidentialClientApplication(config);

export async function isAuthenticated(token: string) {
    cca.acquireTokenSilent()

}