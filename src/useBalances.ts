import { useState } from 'react'
import Talisman from '../../api'

const useBalances = () => {
  const [addresses, setAddresses] = useState([])
  const [chains, setChains] = useState([])
  const [balances, setBalances] = useState([])
  const [status, setStatus] = useState('INITIALIZED')
  const [message, setMessage] = useState()

  const fetch = () => {
    if(status === 'PROCESSING') return
    setBalances([])

    if(!chains.length){
      setMessage('no chain selected')
      setStatus('ERROR')
      return
    }

    if(addresses === ''){
      setMessage('no address selected')
      setStatus('ERROR')
      return
    }

    setMessage(null)
    setStatus('PROCESSING')
    
    Talisman.connect({chains})
      .then(async cf => {
        const _balances = await cf.balance(addresses)
        setBalances(_balances)
        setStatus('READY')
      })
      .catch(e => {
        setMessage(e.message)
        setStatus('ERROR')
      })
  }

  return {
    balances,
    addresses,
    chains,
    setAddresses,
    setChains,
    status,
    message,
    fetch
  }
}

export default useBalances
