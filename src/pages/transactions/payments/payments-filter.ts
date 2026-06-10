export type PaymentsFilter =
  | { type: 'all' }
  | { type: 'account', id: number, title: string }
  | { type: 'group', id: number, title: string }
