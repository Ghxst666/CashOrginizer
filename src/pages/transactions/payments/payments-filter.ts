export type PaymentsFilter =
  | { type: 'all' }
  | { type: 'selection', accountIds: number[], groupIds: number[] }
  | { type: 'account', accountId: number, title?: string }
  | { type: 'group', groupId: number, title?: string }
  | { type: 'purpose', purposeId: number, title?: string }
  | { type: 'project', projectId: number, title?: string }
  | { type: 'category', categoryId: number, title?: string }
