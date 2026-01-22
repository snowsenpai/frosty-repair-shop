import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function usePolling(searchParam: string | null, intervalMs: number = 60000) {
  const router = useRouter()

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Polling triggered')
      // Only refresh if the specific searchParam is not present, to avoid conflicts with user actions
      if (!searchParam) {
        console.log('Refreshing data')
        router.refresh()
      }
    }, intervalMs)

    return () => clearInterval(intervalId)
  }, [searchParam, intervalMs]) // eslint-disable-line react-hooks/exhaustive-deps
}