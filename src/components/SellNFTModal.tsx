import React from 'react'
import SubmitButton from './SubmitButton'
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
  console.log(attributes)

  return (
    <div className="sell-nft-modal">
      <div className="sell-nft-modal-box">
        <img src={image} alt="active-nft" />
        <h2>{name}</h2>
        <div className="sell-nft-attributes">
          {/* <p><span>address:</span> {attributes[0].address}</p>
          <p><span>city: </span>{attributes[0].city}</p>
          <p><span>floor: </span>{attributes[0].floor}</p>
          <p><span>size: </span>{attributes[0].size}</p> */}
        </div>
        <div>
          <p>Set price</p>
          <input type="number" />
        </div>
        <SubmitButton />
      </div>
    </div>
  )
}