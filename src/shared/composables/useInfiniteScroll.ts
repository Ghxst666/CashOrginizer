import { useIntersectionObserver } from '@vueuse/core'
import { MaybeRefOrGetter, ref, Ref, toValue } from 'vue'

interface UseInfiniteScrollReturn {
  target: Ref<HTMLDivElement | null>
}

export function useInfiniteScroll(fetchNextPage?: (options?: any) => Promise<unknown>, hasNextPage?: MaybeRefOrGetter<boolean | undefined>, isFetchingNextPage?: MaybeRefOrGetter<boolean | undefined>): UseInfiniteScrollReturn {
  const target = ref<HTMLDivElement | null>(null)

  useIntersectionObserver(
    target,
    async (entries) => {
      const entry = entries?.[0]
      if (entry?.isIntersecting && toValue(hasNextPage) && !toValue(isFetchingNextPage)) {
        fetchNextPage?.()
      }
    },
    { rootMargin: '100px' },
  )

  return {
    target,
  }
}
