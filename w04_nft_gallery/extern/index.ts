import axios from "axios";
import { NFTObjectType, TokenType } from "../types";

async function getNFTs(
  wallet: string,
  collection?: string,
  pageKey?: string
): Promise<[TokenType[], string]> {
  let tokens: Array<TokenType> = [];
  let newPageKey = "";

  let params = [`owner=${wallet}`, "withMetadata=true"];

  if (collection?.length) params.push(`contractAddresses[]=${collection}`);
  if (pageKey) params.push(`pageKey=${pageKey}`);

  await axios
    .get(
      `${process.env.NEXT_PUBLIC_ALCHEMY_API_ENDPOINT}${
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      }/getNFTs?${params.join("&")}`
    )
    .then(({ data }) => {
      newPageKey = data.pageKey;
      tokens = parseTokensFromNFTsArray(data.ownedNfts);
    })
    .catch((e) => {
      console.log(e);
    });

  return [tokens, newPageKey];
}

async function getNFTsForCollection(collection: string, startToken?: string) {
  let tokens: Array<TokenType> = [];

  let params = [`contractAddress=${collection}`, "withMetadata=true"];

  if (startToken) params.push(`startToken=${startToken}`);

  await axios
    .get(
      `${process.env.NEXT_PUBLIC_ALCHEMY_API_ENDPOINT}${
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      }/getNFTsForCollection?${params.join("&")}`
    )
    .then(({ data }) => {
      tokens = parseTokensFromNFTsArray(data.nfts);
    })
    .catch((e) => {
      console.log(e);
    });

  return tokens;
}

function parseTokensFromNFTsArray(nfts: Array<NFTObjectType>) {
  return nfts.map(({ contract, contractMetadata, id, media }) => ({
    tokenId: parseInt(id?.tokenId, 16),
    mediaURL: media[0]?.gateway,
    contract: {
      address: contract?.address,
      name: contractMetadata?.name,
    },
  }));
}

export { getNFTs, getNFTsForCollection };
