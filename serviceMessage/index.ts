import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getSystemMessage, postSystemMessage } from "../commonResources/appConfig/systemMessage";
import { isAuthenticated } from "../commonResources/authentication/authentication";


const httpTrigger: AzureFunction = async function (
    context: Context,
    request: HttpRequest
  ): Promise<void> {
      try {
          const validRequest = await isAuthenticated(request)
          if (request.method === "GET") {
            
              await getSystemMessage(context, validRequest);
          } else {
              await postSystemMessage(context, validRequest);
          }
      } catch (error) {
        context.res = error 
      }
};

export default httpTrigger;