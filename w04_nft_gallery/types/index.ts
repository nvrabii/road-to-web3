type NFTObjectType = {
  contract: {
    address: string;
  };
  contractMetadata: {
    name: string;
  };
  id: {
    tokenId: string;
  };
  media: Array<{ gateway: string }>;
};

type TokenType = {
  tokenId: number;
  mediaURL: string;
  contract: {
    address: string;
    name: string;
  };
};

export type { NFTObjectType, TokenType };
