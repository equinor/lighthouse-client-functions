import { Context, HttpRequest } from "@azure/functions";
import { SYSTEM_KEY } from "../constants/constants";
import {
  systemMessageOutputValidation,
  systemMessageValidation as serviceMessageValidation,
} from "../utils/validation";
import { appConfigurationClient } from "./appConfigurationClient";

export async function getServiceMessage(
  context: Context,
  request: HttpRequest
) {
  try {
    const result = await appConfigurationClient.getConfigurationSetting({
      key: SYSTEM_KEY,
    });
    const systemMessage = systemMessageOutputValidation(result.value);

    context.res = {
      // status: result.statusCode,
      body: { ...systemMessage },
    };
  } catch (error) {
    context.res = error;
  }
}

export async function postServiceMessage(context: Context, req: HttpRequest) {
  try {
    const value = serviceMessageValidation(req.body);
    if (typeof value !== "string") throw value;
    const result = await appConfigurationClient.setConfigurationSetting({
      key: SYSTEM_KEY,
      value,
    });

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: { status: "done", result },
    };
  } catch (error) {
    context.res = {
      ...error,
    };
  }
}
export async function deleteServiceMessage(context: Context) {
  try {
    const result = await appConfigurationClient.setConfigurationSetting({
      key: SYSTEM_KEY,
      value: "",
    });

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: { status: "done", result },
    };
  } catch (error) {
    context.res = {
      ...error,
    };
  }
}

