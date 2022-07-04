import React, { useState, useEffect } from 'react'
// import { Connection, } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, isValidSolanaAddress } from "@nfteyez/sol-rayz";
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import SellNFTModal from './SellNFTModal'
import './uploadNFT.css';

declare global {
  interface Window {
    solana: any;
  }
}

type ress = {
  mint: string;
  updateAuthority: string;
  data: {
    creators: any[];
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
  };
  key: MetadataKey;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  masterEdition?: string | undefined;
  edition?: string | undefined;
}[] | undefined

interface NFTAttribute {
  address: string;
  city: string;
  floor: string;
  rooms: string;
  size: string;
}
interface ArweaveDataResponse {
  attributes: NFTAttribute[];
  image: string;
  name: string;
  symbol?: string;
}

export default function UploadNFT() {

  const { connection } = useConnection();
  let walletAddress = "";

  const { connected, publicKey } = useWallet();

  if (connected && publicKey) {
    walletAddress = publicKey.toString()
  }

  const [loading, setLoading] = useState(false);
  const [nftDataWithArweaveData, setNftDataWithArweaveData] = useState<ArweaveDataResponse[]>()
  const [xxx, setXxx] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeNft, setActiveNft] = useState<ArweaveDataResponse | null>(null)

  //create a connection of devnet
  // const connection = new Connection(endpoint);

  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };

  async function getAllNftData() {
    try {
      const provider = getProvider()
      console.log(provider)
      // let ownerToken = provider.publicKey
      const result = publicKey !== null && isValidSolanaAddress(walletAddress);

      console.log('result', result)

      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: walletAddress,
        connection: connection,
        sanitize: true
      })

      return nfts
    } catch (error) {
      console.log(error)
    }
  }

  async function getNftTokenData() {
    const nftData = await getAllNftData()
    // @ts-ignore: Unreachable code error
    let dataForFetching = nftData.map(item => item.data.uri)


    let arweaveResponseResult: ArweaveDataResponse[] = []
    dataForFetching.forEach(url => {
      fetch(url)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          arweaveResponseResult.push(result)
        })
    })

    console.log('final data',)
    return arweaveResponseResult
  }

  useEffect(() => {
    async function data() {
      let res = await getNftTokenData();
      console.log('final res', res)
      setNftDataWithArweaveData(res)
      setLoading(true);
    }
    data();
  }, [walletAddress]);

  return (
    <>
      {/* <MyWallet /> */}
      <div>
        {connected &&
          <p>Your wallet is {walletAddress}</p> ||
          <p>Hello! Click the button to connect</p>
        }

        <div className="multi-wrapper">
          <span className="button-wrapper">
            <WalletModalProvider>
              <WalletMultiButton />
            </WalletModalProvider>
          </span>
          {connected && <WalletDisconnectButton />}
        </div>

        {nftDataWithArweaveData?.map(item =>
          <div
            key={item.name}
            className="single-nft"
            onClick={() => setModalVisible(true)}
          >
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            {/* <button>List </button> */}
          </div>)}
      </div>

      <button
        onClick={() => setXxx(xxx => !xxx)}
        type="button"
        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >Show my nft's</button>


      {modalVisible && activeNft && <SellNFTModal activeNft={activeNft} />}
    </>
  )
}