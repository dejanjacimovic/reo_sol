import React from 'react'

interface ArweaveDataResponse {
  activeNft: {
    attributes: NFTAttribute[];
    image: string;
    name: string;
    symbol?: string;
  }
}

interface NFTAttribute {
  address: string;
  city: string;
  floor: string;
  rooms: string;
  size: string;
}

export default function SellNFTModal({ activeNft }: ArweaveDataResponse) {

  const { attributes, image, name } = activeNft

  console.log('attributes', attributes)

  return (
    <div className="sell-nft-modal">
      <img src={image} alt="active-nft" />
      <h2>{name}</h2>
      {attributes.map((item, index) => <div>
        {item}
      </div>)}
    </div>
  )
}