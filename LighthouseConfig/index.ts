import { AppConfigurationClient } from '@azure/app-configuration';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { DefaultAzureCredential } from '@azure/identity';

const credential = new DefaultAzureCredential();
const client = new AppConfigurationClient(
  process.env.APPCONFIG_URL,
  credential
);

// const connectionEndpoint = process.env.APP_CONFIG_ENDPOINT;
// const connectionString = process.env['APPCONFIG_CONNECTION_STRING'] || '';
// const client = new AppConfigurationClient(connectionString);

async function run(context: Context, request: HttpRequest) {
  const fusion = await client.getConfigurationSetting({
    key: 'fusion-scope',
  });
  const clientId = await client.getConfigurationSetting({
    key: 'lighthouse',
  });
  const procosys = await client.getConfigurationSetting({
    key: 'procosys-scopt',
  });
  const tenant = await client.getConfigurationSetting({
    key: 'tenant',
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      fusion: fusion.value,
      procosys: procosys.value,
      clientId: clientId.value,
      tenant: tenant.value,
      host: request.headers.host,
      url: request.url,
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
