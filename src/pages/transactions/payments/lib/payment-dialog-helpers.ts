import type { PaymentType } from '@/entities/transaction/payments/types/payments.types'

export type PaymentDialogType = PaymentType

export interface PaymentCategoryOptionNode {
  id: number
  title: string
  type?: string | null
  children?: PaymentCategoryOptionNode[]
}

export interface PaymentCategoryOption {
  id: number
  title: string
  type: PaymentDialogType
  level?: number
}

export const paymentTypeOptions: Array<{ label: string, value: PaymentDialogType }> = [
  { label: 'Расход', value: 'expenses' },
  { label: 'Приход', value: 'profits' },
  { label: 'Перевод', value: 'transfers' },
]

export function flattenCategoryOptions(
  options: PaymentCategoryOptionNode[],
  inheritedType: PaymentDialogType | null = null,
  level = 0,
): PaymentCategoryOption[] {
  return options.flatMap((option) => {
    const ownType = toPaymentDialogType(option.type)
    const type = ownType ?? inheritedType
    const currentOption = type
      ? [{ id: option.id, title: option.title, type, level }]
      : []

    return [
      ...currentOption,
      ...flattenCategoryOptions(option.children ?? [], type, level + 1),
    ]
  })
}

export function formatAmountForType(value: string, type: PaymentDialogType): string {
  const preparedValue = value.trim()

  if (!preparedValue) return ''

  const unsignedValue = preparedValue.replace(/^[-+]\s*/, '')

  if (!unsignedValue) return ''

  return type === 'expenses'
    ? `-${unsignedValue}`
    : unsignedValue
}

export function formatAmountForPayload(value: string, type: PaymentDialogType): string | null {
  return formatAmountForType(value, type).replace(',', '.') || null
}

export function amountToNumber(value: string, type: PaymentDialogType): number {
  const preparedValue = formatAmountForPayload(value, type)

  if (!preparedValue) return 0

  const amount = Number(preparedValue)

  return Number.isFinite(amount) ? amount : 0
}

function toPaymentDialogType(type?: string | null): PaymentDialogType | null {
  if (type === 'expenses' || type === 'profits' || type === 'transfers') return type

  return null
}
