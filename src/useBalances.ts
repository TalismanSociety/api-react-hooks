import Talisman from '@talismn/api'
import type { Balance } from '@talismn/api'
import { multiplyBigNumbers, planckToTokens } from '@talismn/util'
import { useEffect, useMemo, useState } from 'react'

export type { Balance } from '@talismn/api'
export type Status = 'INITIALIZED' | 'PROCESSING' | 'READY' | 'ERROR'

export function useBalances(_addresses: string[] = [], chains: string[] = [], rpcs?: { [key: string]: string[] }) {
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

export function groupBalancesByChain(
  chainIds: string[],
  balances: Array<Balance | null>
): { [key: string]: Balance[] } {
  const byChain = Object.fromEntries(chainIds.map<[string, Balance[]]>(chainId => [chainId, []]))

  balances
    .filter((balance): balance is Balance => balance !== null)
    .filter(balance => typeof balance.chainId === 'string')
    .filter(balance => chainIds.includes(balance.chainId))
    .forEach(balance => {
      byChain[balance.chainId].push(balance)
    })

  return byChain
}

export function groupBalancesByAddress(balances: Array<Balance | null>): { [key: string]: Balance[] } {
  const byAddress: { [key: string]: Balance[] } = {}

  balances
    .filter((balance): balance is Balance => balance !== null)
    .filter(balance => typeof balance.address === 'string')
    .forEach(balance => {
      if (!byAddress[balance.address]) byAddress[balance.address] = []
      byAddress[balance.address].push(balance)
    })

  return byAddress
}

// TODO: Move to dedicated token price lib

export type BalanceWithTokens = Balance & { tokens?: string }

export function addTokensToBalances(
  balances: Array<Balance | null>,
  tokenDecimals?: number
): Array<BalanceWithTokens | null> {
  return balances.map(balance =>
    balance === null ? null : { ...balance, tokens: planckToTokens(balance.free, tokenDecimals) }
  )
}

export type BalanceWithTokensWithPrice = BalanceWithTokens & { usd?: string }

export function addPriceToTokenBalances(
  balances: Array<BalanceWithTokens | null>,
  tokenPrice?: string
): Array<BalanceWithTokensWithPrice | null> {
  if (typeof tokenPrice !== 'number') return balances

  return balances.map(balance =>
    balance === null
      ? null
      : {
          ...balance,
          usd: multiplyBigNumbers(balance.tokens, tokenPrice),
        }
  )
}
