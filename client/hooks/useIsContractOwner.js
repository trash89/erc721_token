import { useNetwork, useAccount, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks";
import { addressNotZero } from "../utils/utils";

const useIsContractOwner = (contractAddress, contractABI) => {
  const isMounted = useIsMounted();
  const { activeChain } = useNetwork();
  const isEnabled = Boolean(
    isMounted && activeChain && addressNotZero(contractAddress)
  );
  const {
    data: account,
    isError: isErrorAccount,
    isLoading: isLoadingAccount,
  } = useAccount({ enabled: isEnabled });
  const {
    data: ContractOwner,
    isError: isErrorContractOwner,
    isLoading: isLoadingContractOwner,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "owner",
    {
      enabled: Boolean(isEnabled && account),
      watch: Boolean(isEnabled && account),
    }
  );

  if (
    !isMounted ||
    !activeChain ||
    !account ||
    isErrorAccount ||
    isErrorContractOwner ||
    isLoadingAccount ||
    isLoadingContractOwner
  ) {
    return {
      ContractOwner: ContractOwner,
      isOwner: false,
    };
  }
  return {
    ContractOwner: ContractOwner,
    isOwner: account?.address === ContractOwner,
  };
};

export default useIsContractOwner;
