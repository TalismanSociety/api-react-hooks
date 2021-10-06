// TODO: Import chaindata via @talismn/api instead of going directly to @talismn/chaindata-js
import chaindata, { Chain } from '@talismn/chaindata-js'
import { useEffect, useState } from 'react'

export function useChains() {
  const [chainData, setChainData] = useState<{ [key: string]: string } | null>(null)
  useEffect(() => {
    ;(async () => setChainData(await chaindata.chains()))()
  }, [])

  return chainData
}

export function useChain(id: string) {
  const [chain, setChain] = useState<Chain | any>({})
  useEffect(() => {
    ;(async () => setChain(await chaindata.chain(id)))()
  }, [id])

  return chain
}
