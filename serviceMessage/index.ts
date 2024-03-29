import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  deleteServiceMessage,
  getServiceMessage,
  postServiceMessage,
} from "../commonResources/appConfig/serviceMessage";
import { isAuthenticated } from "../commonResources/authentication/authentication";

const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  try {
    const validRequest = await isAuthenticated(request);
    if (request.method === "GET") {
      await getServiceMessage(context, validRequest);
    } else if (request.method === "DELETE") {
      await deleteServiceMessage(context);
    } else {
      await postServiceMessage(context, validRequest);
    }
  } catch (error) {
    context.res = error;
  }
};

export default httpTrigger;

