import { isEmpty } from 'lodash-es'

/** Функция для очистка объекта от пустых значений (не очищает вложенные объекты) */
export function clearEmptyProperties<T extends object>(params?: T): Partial<T> | undefined {
  if (!params)
    return

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => {
        // Фильтрация массивов, объектов и строк
        if (Array.isArray(value) || value instanceof Object || typeof value === 'string') {
          return !isEmpty(value)
        }
        // Фильтрация undefined и null
        if (value === undefined || value === null) {
          return false
        }

        return true
      },
    ),
  ) as Partial<T>

  if (!isEmpty(filteredParams))
    return filteredParams
  else
    return undefined
}
