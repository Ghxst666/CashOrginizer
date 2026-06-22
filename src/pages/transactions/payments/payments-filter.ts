export type PaymentsFilter =
  | { type: 'all' }
  | { type: 'selection', accountIds: number[], groupIds: number[] }
