import { ServiceMessage } from "../types/serviceMessage";

export function systemMessageValidation(
  serviceMessage?: ServiceMessage
):
  | { status: number; body: { message: string; missingKeys?: string[] } }
  | string {
  const keys = ["message", "type", "fromDate", "toDate"];
  if (!serviceMessage) {
    return {
      status: 422,
      body: { message: "No valid Body provided", missingKeys: keys },
    };
  }
  const missingKeys: string[] = [];
  keys.map((key) => {
    if (!Object.keys(serviceMessage).includes(key)) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    return {
      status: 422,
      body: { message: "Key missing in body", missingKeys },
    };
  }

  if (isValidDate(serviceMessage.fromDate)) {
    return { status: 422, body: { message: "invalidDate fromDate" } };
  }

  if (isValidDate(serviceMessage.toDate)) {
    return { status: 422, body: { message: "invalidDate toDate" } };
  }
  serviceMessage.id = generateQuickGuid();
  return JSON.stringify(serviceMessage);
}

function generateQuickGuid() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function systemMessageOutputValidation(
  data?: string
): ServiceMessage | undefined {
  try {
    const systemMessage = JSON.parse(data);
    const currentDate = new Date().valueOf();
    const toDate = new Date(systemMessage?.toDate).valueOf();
    const fromDate = new Date(systemMessage?.fromDate).valueOf();
    if (currentDate <= fromDate && toDate >= currentDate) {
      return systemMessage;
    }

    return;
  } catch {
    return;
  }
}

function isValidDate(date: string): boolean {
  return date === "" || Date.parse(date).toString() === "NaN";
}

export function isValidEnvironment(id: string): boolean {
  switch (id) {
    case "prod":
    case "dev":
    case "test":
      return true;
    default:
      return false;
  }
}

