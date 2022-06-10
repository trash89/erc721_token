import Stack from "@mui/material/Stack";
import { useIsMounted, useGetContract } from "../hooks";
import { useNetwork, useAccount } from "wagmi";
import { addressNotZero } from "../utils/utils";

import { SupportedNetworks, MyNFT } from "../components";

const MyNFTContainer = () => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const { address: nftAddress, ABI: nftABI } = useGetContract("MyNFT");
  const {
    data: account,
    error: errorAccount,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
    isSuccess: isSuccessAccount,
  } = useAccount({
    enabled: Boolean(isMounted && activeChain && addressNotZero(nftAddress)),
  });

  if (!isMounted) return <></>;
  if (!activeChain) {
    return <SupportedNetworks />;
  }
  if (isLoadingAccount) return <div>Loading account…</div>;
  if (isErrorAccount) {
    return <div>Error loading account: {errorAccount?.message}</div>;
  }
  if (!addressNotZero(nftAddress)) {
    return (
      <div>Contract not deployed on this network : {activeChain?.name}</div>
    );
  }

  return (
    <>
      {isSuccessAccount && (
        <Stack
          direction="column"
          spacing={1}
          padding={1}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <MyNFT
            activeChain={activeChain}
            nftAddress={nftAddress}
            nftABI={nftABI}
            account={account}
          />
        </Stack>
      )}
    </>
  );
};

export default MyNFTContainer;
