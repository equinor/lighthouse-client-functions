import {
  AppConfigurationClient,
  ConfigurationSetting,
} from '@azure/app-configuration';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { DefaultAzureCredential } from '@azure/identity';
import { decrypt } from './crypt';

const credential = new DefaultAzureCredential();
const client = new AppConfigurationClient(
  process.env.APPCONFIG_URL,
  credential
);

function isValid(id: string): boolean {
  switch (id) {
    case 'prod':
    case 'dev':
    case 'qa':
      return true;
    default:
      return false;
  }
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await run(context, req);
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

async function run(context: Context, request: HttpRequest) {
  if (!request.query.environmentId) {
    context.res = {
      status: 400,
      body: {
        error: 'environmentId query-parameter is not provided.',
      },
    };
    return;
  }

  const environmentId = decrypt('environmentId', request.query.environmentId);

  if (isValid(environmentId)) {
    const settingsBody = await getSettings(environmentId);

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        host: request.headers.host,
        url: request.url,
        ...settingsBody,
        isProduction: environmentId === 'prod',
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
}

async function getSettings(environmentId: string) {
  const response = await client.listConfigurationSettings({
    labelFilter: environmentId,
  });

  const settings: ConfigurationSetting<string>[] = [];
  for await (const setting of response) {
    settings.push(setting);
  }

  return settings.reduce((acc, item) => {
    acc[item.key.toString()] = JSON.parse(item.value);
    return acc;
  }, {} as { [key: string]: string });
}
