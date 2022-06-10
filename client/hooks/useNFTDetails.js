import { useContractRead } from "wagmi";
import { useIsMounted } from ".";
import { addressNotZero } from "../utils/utils";
import { BigNumber, utils } from "ethers";

const useNFTDetails = (activeChain, nftAddress, nftABI, account) => {
  const isMounted = useIsMounted();
  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(nftAddress)
  );

  const { data: owner, isError: isErrorOwner } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "owner",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  const { data: name, isError: isErrorName } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "name",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  const { data: symbol, isError: isErrorSymbol } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "symbol",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );
  const { data: balanceOf, isError: isErrorBalanceOf } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "balanceOf",
    {
      args: [account?.address],
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  const { data: totalSupply, isError: isErrorTotalSupply } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "totalSupply",
    {
      enabled: isEnabled,
      watch: isEnabled,
    }
  );

  if (
    !isMounted ||
    !activeChain ||
    !account ||
    !owner ||
    isErrorOwner ||
    isErrorBalanceOf ||
    isErrorName ||
    isErrorSymbol ||
    isErrorTotalSupply
  ) {
    return {
      isSuccess: false,
      isOwner: false,
      ContractOwner: owner,
      name: "",
      symbol: "",
      balanceOf: BigNumber.from("-1"),
      totalSupply: BigNumber.from("-1"),
    };
  }
  return {
    isSuccess: true,
    isOwner: utils.getAddress(account?.address) === utils.getAddress(owner),
    ContractOwner: owner,
    name: name,
    symbol: symbol,
    balanceOf: balanceOf,
    totalSupply: totalSupply,
  };
};

export default useNFTDetails;
