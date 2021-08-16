import { useEffect, useState } from 'react'

// TODO: Import chaindata via @talismn/api instead of going directly to @talismn/chaindata-js
import chaindata from '@talismn/chaindata-js'

export function useChains() {
  const [chainData, setChainData] = useState([])
  useEffect(() => {
    ;(async () => setChainData(await chaindata.chains()))()
  }, [])

  return chainData
}

export function useChain(id: string) {
  const [chain, setChain] = useState<any>({})
  useEffect(() => {
    ;(async () => setChain(await chaindata.chain(id)))()
  }, [id])

  return chain
}
