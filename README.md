<h1 align="center">
    Hardhat NFTs
</h1>

<br/>
 
<p align="center">
<img src="./images/randomNft/pug.png" width="225" alt="NFT Pug">
<img src="./images/randomNft/shiba-inu.png" width="225" alt="NFT Shiba">
<img src="./images/randomNft/st-bernard.png" width="225" alt="NFT St.Bernard">
<img src="./images/dynamicNft/frown.svg" width="225" alt="NFT Frown">
<img src="./images/dynamicNft/happy.svg" width="225" alt="NFT Happy">
</p>
<br/>

We go through creating 3 different kinds of NFTs:

1. A Basic NFT

2. IPFS Hosted NFT

    That uses Randomness to generate a unique NFT
  
3. SVG NFT (Hosted 100% on-chain)

    Uses price feeds to be dynamic


<hr/>

## 🗎&nbsp; Requirements
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
    
- [Nodejs](https://nodejs.org/en/)

    You'll know you've installed nodejs right if you can run: `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
   
   You'll know you've installed yarn right if you can run: `yarn --version` and get an output like: `x.x.x`
   
   You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## 🛠️&nbsp; How to run
- Clone the repo:
    ```
    git clone https://github.com/Meno96/hardhat-nft.git
    ```
- Enter the directory:
    ```
    cd hardhat-nft
    ```
- Install packages:
    ```
    yarn
    ```
    
## 🚀&nbsp; How it's suppose to work?

### Deploy

```
yarn hardhat deploy
```

### Testing

```
yarn hardhat test
```

#### Test Coverage

```
yarn hardhat coverage
```
 
### Deployment to a testnet or mainnet

1. Setup environment variables

    You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

    - `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
    - `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

    Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Setup a Chainlink VRF Subscription ID

    Head over to [vrf.chain.link](https://vrf.chain.link/) and setup a new subscription, and get a subscriptionId. You can reuse an old subscription if you already have one. 

    [You can follow the instructions](https://docs.chain.link/docs/get-a-random-number/) if you get lost. You should leave this step with:

      - A subscription ID
      - Your subscription should be funded with LINK

4. Deploy

    In your `helper-hardhat-config.js` add your `subscriptionId` under the section of the chainId you're using (aka, if you're deploying to goerli, add your `subscriptionId` in the `subscriptionId` field under the `4` section.)

    Then run:
    ```
    yarn hardhat deploy --network goerli --tags main
    ```
    
    We only deploy the `main` tags, since we need to add our `RandomIpfsNft` contract as a consumer. 

5. Add your contract address as a Chainlink VRF Consumer

    Go back to [vrf.chain.link](https://vrf.chain.link) and under your subscription add `Add consumer` and add your contract address. You should also fund the contract with a minimum of 1 LINK. 

6. Mint NFTs

    Then run:

    ```
    yarn hardhat deploy --network goerli --tags mint
    ```

### Estimate gas

You can estimate how much gas things cost by running:

```
yarn hardhat test
```

And you'll see and output file called `gas-report.txt`

#### Estimate gas cost in USD

To get a USD estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from [CoinMarketCap](https://pro.coinmarketcap.com/signup). 

Then, uncomment the line `coinmarketcap: COINMARKETCAP_API_KEY,` in `hardhat.config.js` to get the USD estimation. Just note, everytime you run your tests it will use an API call, so it might make sense to have using coinmarketcap disabled until you need it. You can disable it by just commenting the line back out. 


### Verify on etherscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://etherscan.io/myapikey) from Etherscan and set it as an environemnt variable named `ETHERSCAN_API_KEY`. You can pop it into your `.env` file as seen in the `.env.example`.

In it's current state, if you have your api key set, it will auto verify goerli contracts!

However, you can manual verify with:

```
yarn hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```

### Linting

`solhint` installation: [Documentation](https://protofire.github.io/solhint/#installation)

To check linting / code formatting:
```
yarn lint
```

or, to fix: 

```
yarn lint:fix
```

### Formatting 

```
yarn format
```

## 📫&nbsp; Have a question? Want to chat? 

[LinkedIn](https://www.linkedin.com/in/daniele-menin/)

[Instagram](https://www.instagram.com/danielemeno96/)
