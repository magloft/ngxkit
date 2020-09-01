export class SwCriticalError extends Error {
  readonly isCritical: boolean = true
}

export function errorToString(error: any): string {
  if (error instanceof Error) {
    return `${error.message}\n${error.stack}`
  } else {
    return `${error}`
  }
}
