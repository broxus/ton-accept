export type GetTokensInfo = {
  $schema: string;
  name: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  keywords: string[];
  timestamp: string;
  tokens: {
    name: string;
    chainId: number;
    symbol: string;
    decimals: number;
    address: string;
    logoURI: string;
    version: number;
  }[];
};

export const getTokensInfo = async (): Promise<GetTokensInfo | null> => {
  const response = await fetch(
    "https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json"
  );
  if (response.ok) {
    return response.json();
  }
  // eslint-disable-next-line no-console
  console.error(`getTokensInfo error: ${response.status}`);
  return null;
};
