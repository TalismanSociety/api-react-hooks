import { useCallback, useEffect, useRef, useState } from 'react'

import Talisman from '@talismn/api'
import type { Balance } from '@talismn/api'

export type Status = 'INITIALIZED' | 'PROCESSING' | 'READY' | 'ERROR'

export default function useBalances(
  addresses: string | string[] = [],
  chains: string | string[] = [],
  rpcs?: { [key: string]: string[] }
) {
  const [balances, setBalances] = useState<Array<Balance | null>>([])
  const [status, setStatus] = useState<Status>('INITIALIZED')
  const [message, setMessage] = useState<string | null>(null)

  const statusRef = useRef(status)
  statusRef.current = status

  const fetchBalances = useCallback((addresses: string[], chains: string[]) => {
    const status = statusRef.current
    if (status === 'PROCESSING') return

    if (!chains.length) {
      setMessage('no chain selected')
      setStatus('ERROR')
      return
    }

    if (addresses.length < 1) {
      setMessage('no address selected')
      setStatus('ERROR')
      return
    }

    setMessage(null)
    setStatus('PROCESSING')

    Talisman.connect({ type: 'TALISMANCONNECT', chains, rpcs })
      .then(async chainFactory => {
        const balances = await chainFactory.balance(addresses)
        setBalances(balances)
        setStatus('READY')
      })
      .catch(error => {
        setMessage(error.message)
        setStatus('ERROR')
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
