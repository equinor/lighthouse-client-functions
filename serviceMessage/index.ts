import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getSystemMessage, postSystemMessage } from "../commonResources/appConfig/systemMessage";
import { isAuthenticated } from "../commonResources/authentication/authentication";


const httpTrigger: AzureFunction = async function (
    context: Context,
    request: HttpRequest
  ): Promise<void> {
      try {
          if (request.method === "GET") {
              await getSystemMessage(context, await isAuthenticated(request));
          } else {
              await postSystemMessage(context, await isAuthenticated(request));
          }
      } catch (error) {
        context.res = error 
      }
};

export default httpTrigger;