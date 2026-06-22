export type InvoicesAccountsFilter =
  | { type: 'all' }
  | { type: 'selection', accountIds: number[], groupIds: number[] }
