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

async function run(context: Context, request: HttpRequest) {
  const environmentId = decrypt(
    'environmentId',
    request.query.environmentId || ''
  );

  const response = await client.listConfigurationSettings({
    labelFilter: environmentId,
  });

  const settings: ConfigurationSetting<string>[] = [];
  for await (const setting of response) {
    settings.push(setting);
  }

  const settingsBody = settings.reduce((acc, item) => {
    acc[item.key.toString()] = JSON.parse(item.value);
    return acc;
  }, {} as { [key: string]: string });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      host: request.headers.host,
      url: request.url,
      ...settingsBody,
    },
  };
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
        isDone: true,
      },
    };
  }
};

export default httpTrigger;
