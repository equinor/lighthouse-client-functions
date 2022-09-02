import { SystemMessage } from "../types/systemMessage";

export function systemMessageValidation(
  systemMessage?: SystemMessage
):
  | { status: number; body: { message: string; missingKeys?: string[] } }
  | string {
  const keys = ["message", "type", "fromDate", "toDate"];
  if (!systemMessage) {
    return {
      status: 422,
      body: { message: "No valid Body provided", missingKeys: keys },
    };
  }
  const missingKeys: string[] = [];
  keys.map((key) => {
    if (!Object.keys(systemMessage).includes(key)) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    return {
      status: 422,
      body: { message: "Key missing in body", missingKeys },
    };
  }

  if (isValidDate(systemMessage.fromDate)) {
    return { status: 422, body: { message: "invalidDate fromDate" } };
  }

  if (isValidDate(systemMessage.toDate)) {
    return { status: 422, body: { message: "invalidDate toDate" } };
  }
  systemMessage.id = generateQuickGuid();
  return JSON.stringify(systemMessage);
}

function generateQuickGuid() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function systemMessageOutputValidation(
  data?: string
): SystemMessage | undefined {
  try {
    const systemMessage = JSON.parse(data);
    const currentDate = new Date().getTime();
    const toDate = new Date(systemMessage?.toDate).getTime();
    const fromDate = new Date(systemMessage?.fromDate).getDate();
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

