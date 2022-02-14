import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getAppConfigurationByEnvironmentId } from '../commonResources/appConfig/getAppConfiguration';
import { ENVIRONMENT_ID } from '../commonResources/constants/constants';
import { decrypt } from '../commonResources/utils/crypt';
import { isValidEnvironment } from '../commonResources/utils/validation';


const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  try {
    if (!request.query.environmentId) {
      context.res = {
        status: 400,
        body: {
          error: 'environmentId query-parameter is not provided.',
        },
      };
      return;
    }
  
    const environmentId = decrypt(ENVIRONMENT_ID, request.query.environmentId);
  
    if (isValidEnvironment(environmentId)) {
      const settingsBody = await getAppConfigurationByEnvironmentId(environmentId);
  
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
          host: request.headers.host,
          url: request.url,
          isProduction: environmentId === 'prod',
          ...settingsBody,
        },
      };
    } else {
      context.res = {
        status: 400,
        body: {
          error: 'environmentId is not valid.',
        },
      };
    }
  } catch (error) {
    context.res = {
      status: 404,
      body: {
        error,
      },
    };
  }
};

export default httpTrigger;


