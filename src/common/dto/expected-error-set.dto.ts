export type ExpectedErrorSetDto = Record<string, string>;

export enum QueryErrorCodes {
  FOREIGN_KEY_VIOLATION = '23503',
  UNIQUE_VIOLATION = '23505',
}
