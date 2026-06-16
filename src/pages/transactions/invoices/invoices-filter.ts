export type InvoicesAccountsFilter =
  | { type: 'all' }
  | { type: 'group', id: number, title: string }
