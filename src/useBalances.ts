import Talisman from '@talismn/api'
import type { Balance } from '@talismn/api'
import { useEffect, useMemo, useState } from 'react'

export type Status = 'INITIALIZED' | 'PROCESSING' | 'READY' | 'ERROR'

export default function useBalances(
  _addresses: string[] = [],
  chains: string[] = [],
  rpcs?: { [key: string]: string[] }
) {
  // TODO: Move addresses out of useGuardian so they don't need to be memoised here
  const [addresses, setAddresses] = useState<string[]>([])
  useEffect(() => {
    setAddresses(addresses =>
      _addresses.some((address, index) => addresses[index] !== address) ? _addresses : addresses
    )
  }, [_addresses])

  const [balancesIndexed, setBalancesIndexed] = useState<{ [key: string]: Balance | null }>({})
  useEffect(() => {
    if (!Array.isArray(addresses)) return
    if (addresses.filter(Boolean).length < 1) return

    if (!Array.isArray(chains)) return
    if (chains.filter(Boolean).length < 1) return

    const unsubscribe = Talisman.init({ type: 'TALISMANCONNECT', rpcs }).subscribeBalances(
      chains,
      addresses,
      (balance, chainId, address) =>
        setBalancesIndexed(balances => ({ ...balances, [`${chainId}_${address}`]: balance }))
    )

    return unsubscribe
  }, [addresses, chains])

  const balances = useMemo(() => Object.values(balancesIndexed).filter(Boolean), [balancesIndexed])

  return { balances }
}
