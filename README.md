>
> This repo is no longer maintained.
>
> Talisman's token balance support is now part of the `@talismn/balances` collection of packages.
>
> The source code for these packages can be found in the `packages` directory of the [Talisman monorepo](https://github.com/talismansociety/talisman).
>

# @talismn/api-react-hooks

<img src="1f9ff-react.svg" alt="Talisman" width="15%" align="right" />

[![license](https://img.shields.io/github/license/talismansociety/api-react-hooks?style=flat-square)](https://github.com/TalismanSociety/api-react-hooks/blob/master/LICENCE)
[![npm-version](https://img.shields.io/npm/v/@talismn/api-react-hooks?style=flat-square)](https://www.npmjs.com/package/@talismn/api-react-hooks)
[![npm-downloads](https://img.shields.io/npm/dw/@talismn/api-react-hooks?style=flat-square)](https://www.npmjs.com/package/@talismn/api-react-hooks)
[![discord-link](https://img.shields.io/discord/858891448271634473?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/rQgTD9SGtU)

**A set of react hooks to use the @talismn/api.**

Exposes the following hooks:

- `useBalances`
- `useChains`
- `useChain`

## Usage

#### useBalances

Provides current balances for the addresses and chains provided.

```ts
import { useBalances } from '@talismn/api-react-hooks'

useBalances(
  addresses: string[] = [],
  chains: string[] = [],
  rpcs?: { [key: string]: string[] }
)
```

Takes the following arguments:

- `addresses`: an array of strings of addresses.
- `chains`: an array of strings of chain IDs.
- `rpcs`: Optional. An object containing `chainId`:`RPC` pairs in order to specify particular RPCs to connect to.

Returns an array of `Balance` objects like:

```ts
[{
  chainId: Chain ID,
  address: DotSama address,
  token: Symbol of native token of chain,

  total: Total balance of token,
  free: Free balance of token,
  reserved: Reserved balance of token,
  miscFrozen: Misc frozen balance of token,
  feeFrozen: Fee frozen balance of token,
}]
```

### useChains

Discover which chains are available.

```ts
import { useChains } from '@talismn/api-react-hooks'

const chains = useChains()
```

The returned object contains key:value pairs of all available chain ids and names.

```json
{
  "0": "Polkadot",
  "2": "Kusama"
  // ... etc
}
```

### useChain

Fetch a chain by ID and load all relevant information. In this example, Polkadot (id: 0).

```ts
import { useChain } from '@talismn/api-react-hooks'

const chain = useChain(0)
```

The returned object contains all relevant information about the requested chain.

```json
{
  "id": "0",
  "name": "Polkadot",
  "description": "Polkadot is a heterogeneous multichain with shared security and interoperability",
  "isRelay": true,
  "links": {
    "Website": "https://polkadot.network",
    "Twitter": "https://twitter.com/Polkadot",
    "Support": "https://support.polkadot.network/support/home",
    "Discord": "https://discord.com/invite/wGUDt2p",
    "Github": "https://github.com/paritytech/polkadot"
  },
  "assets": {
    "logo": "logo.svg",
    "banner": "banner.png",
    "card": "card.png"
  },
  "rpcs": ["wss://rpc.polkadot.io"],
  "status": "READY"
}
```
