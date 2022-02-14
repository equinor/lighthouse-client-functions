import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getSystemMessage, postSystemMessage } from "../commonResources/appConfig/systemMessage";


const httpTrigger: AzureFunction = async function (
    context: Context,
    request: HttpRequest
  ): Promise<void> {
    if (request.method === "GET") {
        await getSystemMessage(context, request);
    } else {
        await postSystemMessage(context, request);
    }
};

export default httpTrigger;