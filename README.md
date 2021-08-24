# @talismn/api-react-hooks
**A set of react hooks to use the @talismn/api.**
**Exposes the following hooks:**
- `useBalances`
- `useChains`
- `useChain`
##Usage
####useBalances
Provides current balances for the addresses and chains provided.
```
import { useBalances } from '@talismn/api-react-hooks'

useBalances(
  addresses: string | string[] = [],
  chains: string | string[] = [],
  rpcs?: { [key: string]: string[] }
)
```
Takes the following arguments:
 - `addresses`: a string or array of strings of addresses.
 - `chains`: a string or array of strings of chain IDs.
 - `rpcs`: Optional. An object containing `chainId`:`RPC` pairs in order to specify particular RPCs to connect to.

Returns an array of `Balance` objects like:
```
[{
  chainId: Chain ID,
  token: Name of native token of chain,
  address: Address,
  total: Total balance of token,
  free: Free balance of token,
  reserved: Reserved balance of token,
}]
```

###useChains

Discover which chains are available.

```
import { useChains } from '@talismn/api-react-hooks'

const chains = useChains() 
```
The returned object contains key:value pairs of all available chain ids and names.
```
{
  "0": "Polkadot",
  "2": "Kusama",
  // ... etc
}
```


###useChain

Fetch a chain by ID and load all relevant information. In this example, Polkadot (id: 0).

```
import { useChain } from '@talismn/api-react-hooks'

const chain = useChain(0)
```
The returned object contains all relevant information about the requested chain.
```
{
  "id": "0",
  "name": "Polkadot",
  "description": "Polkadot is a heterogeneous multichain with shared security and interoperability",
  "isRelay": true,
  "links":{
    "Website": "https://polkadot.network",
    "Twitter": "https://twitter.com/Polkadot",
    "Support": "https://support.polkadot.network/support/home",
    "Discord": "https://discord.com/invite/wGUDt2p",
    "Github": "https://github.com/paritytech/polkadot"
  },
  "assets":{
    "logo": "logo.svg",
    "banner": "banner.png",
    "card": "card.png"
  },
  "rpcs": [
    "wss://rpc.polkadot.io"
  ],
  "status": "READY",
}
```




