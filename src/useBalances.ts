import { useCallback, useEffect, useRef, useState } from 'react'

import Talisman from '@talismn/api'

export const enum Status {
  INITIALIZED = 'INITIALIZED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ERROR = 'ERROR',
}

export default function useBalances(
  addresses: string | string[] = [],
  chains: string | string[] = [],
  rpcs?: { [key: string]: string[] }
) {
  const [balances, setBalances] = useState([])
  const [status, setStatus] = useState(Status.INITIALIZED)
  const [message, setMessage] = useState<string | null>(null)

  const statusRef = useRef(status)
  statusRef.current = status

  const fetchBalances = useCallback((addresses: string[], chains: string[]) => {
    const status = statusRef.current
    if (status === Status.PROCESSING) return

    if (!chains.length) {
      setMessage('no chain selected')
      setStatus(Status.ERROR)
      return
    }

    if (addresses.length < 1) {
      setMessage('no address selected')
      setStatus(Status.ERROR)
      return
    }

    setMessage(null)
    setStatus(Status.PROCESSING)

    Talisman.connect({ chains, rpcs })
      .then(async cf => {
        const _balances = await cf.balance(addresses)
        setBalances(_balances)
        setStatus(Status.READY)
      })
      .catch(e => {
        setMessage(e.message)
        setStatus(Status.ERROR)
      })
  }, [])

  useEffect(() => {
    if (!addresses) return
    if (Array.isArray(addresses) && addresses.filter(Boolean).length < 1) return

    if (!chains) return
    if (Array.isArray(chains) && chains.filter(Boolean).length < 1) return

    fetchBalances(Array.isArray(addresses) ? addresses : [addresses], Array.isArray(chains) ? chains : [chains])
  }, [addresses, chains, fetchBalances])

  return { balances, status, message, refetch: fetchBalances }
}
