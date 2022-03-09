import { ConfigurationSetting } from "@azure/app-configuration";
import { appConfigurationClient } from "./appConfigurationClient";

export async function getAppConfigurationByEnvironmentId(environmentId: string) {
    const response = await appConfigurationClient.listConfigurationSettings({
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