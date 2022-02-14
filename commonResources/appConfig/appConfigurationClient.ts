import {
    AppConfigurationClient
} from '@azure/app-configuration';
import { DefaultAzureCredential } from '@azure/identity';
  
const credential = new DefaultAzureCredential();
export const appConfigurationClient = new AppConfigurationClient(
    process.env.APPCONFIG_URL,
    credential
);
  