import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { ethers, utils, constants, BigNumber } from "ethers";
import { useContract, useContractRead, useProvider } from "wagmi";
import { addressNotZero, shortenAddress, formatBalance } from "../utils/utils";
import { useIsMounted, useNFTDetails, useGetFuncWrite } from "../hooks";
import { GetStatusIcon, ShowError } from ".";

// owner
// balanceOf
// name
// symbol
// totalSupply

// safeMint
// burn
// approve
// tokenOfOwnerByIndex
// tokenURI
// transferOwnership
// renounceOwnership
// pause
// unpause

// transferFrom
// safeTransferFrom

// ownerOf

// tokenByIndex

const verifyAddress = (address) => {
  if (address) {
    if (utils.isAddress(address)) return utils.getAddress(address);
    else return constants.AddressZero;
  } else return account?.address;
};

const MyNFT = ({ activeChain, nftAddress, nftABI, account }) => {
  const isMounted = useIsMounted();
  const [disabled, setDisabled] = useState(false);

  const isEnabled = Boolean(
    isMounted && activeChain && account && addressNotZero(nftAddress)
  );
  const [input, setInput] = useState({
    from: "",
    to: "",
    URI: "",
    tokenId: "",
    interfaceId: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    from: false,
    to: false,
    URI: false,
    tokenId: false,
    interfaceId: false,
  });

  // NFT details for display
  const {
    isSuccess,
    isOwner,
    ContractOwner: nftOwner,
    name,
    symbol,
    totalSupply,
  } = useNFTDetails(activeChain, nftAddress, nftABI, account);

  const {
    data: balanceOf,
    isError: isErrorBalanceOf,
    refetch: refetchBalanceOf,
  } = useContractRead(
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

  let nftArray = [
    ...Array.from({ length: parseInt(balanceOf) }, (_, idx) => `${idx}`),
  ];

  // safeMint function
  const {
    error: errorSafeMint,
    isError: isErrorSafeMint,
    write: writeSafeMint,
    status: statusSafeMint,
    statusWait: statusSafeMintWait,
  } = useGetFuncWrite("safeMint", activeChain, nftAddress, nftABI, isEnabled);

  // burn function
  const {
    error: errorBurn,
    isError: isErrorBurn,
    write: writeBurn,
    status: statusBurn,
    statusWait: statusBurnWait,
  } = useGetFuncWrite("burn", activeChain, nftAddress, nftABI, isEnabled);

  // approve(address to, uint256 tokenId)
  const {
    error: errorApprove,
    isError: isErrorApprove,
    write: writeApprove,
    status: statusApprove,
    statusWait: statusApproveWait,
  } = useGetFuncWrite("approve", activeChain, nftAddress, nftABI, isEnabled);

  // transferOwnership(address newOwner)
  const {
    error: errorTransferOwnership,
    isError: isErrorTransferOwnership,
    write: writeTransferOwnership,
    status: statusTransferOwnership,
    statusWait: statusTransferOwnershipWait,
  } = useGetFuncWrite(
    "transferOwnership",
    activeChain,
    nftAddress,
    nftABI,
    isEnabled
  );

  // renounceOwnership(address newOwner)
  const {
    error: errorRenounceOwnership,
    isError: isErrorRenounceOwnership,
    write: writeRenounceOwnership,
    status: statusRenounceOwnership,
    statusWait: statusRenounceOwnershipWait,
  } = useGetFuncWrite(
    "renounceOwnership",
    activeChain,
    nftAddress,
    nftABI,
    isEnabled
  );

  // transferFrom(address from, address to, uint256 tokenId)
  const {
    error: errorTransferFrom,
    isError: isErrorTransferFrom,
    write: writeTransferFrom,
    status: statusTransferFrom,
    statusWait: statusTransferFromWait,
  } = useGetFuncWrite(
    "transferFrom",
    activeChain,
    nftAddress,
    nftABI,
    isEnabled
  );

  // pause()
  const {
    error: errorPause,
    isError: isErrorPause,
    write: writePause,
    status: statusPause,
    statusWait: statusPauseWait,
  } = useGetFuncWrite("pause", activeChain, nftAddress, nftABI, isEnabled);

  // unpause()
  const {
    error: errorUnpause,
    isError: isErrorUnpause,
    write: writeUnpause,
    status: statusUnpause,
    statusWait: statusUnpauseWait,
  } = useGetFuncWrite("unpause", activeChain, nftAddress, nftABI, isEnabled);

  useEffect(() => {
    refetchBalanceOf();
  }, [input.tokenId, handleSafeMint, handleBurn, handleTokenId]);

  // useEffect to setup values
  useEffect(() => {
    if (
      statusSafeMint !== "loading" &&
      statusBurn !== "loading" &&
      statusApprove !== "loading" &&
      statusTransferOwnership !== "loading" &&
      statusRenounceOwnership !== "loading" &&
      statusTransferFrom !== "loading" &&
      statusPause !== "loading" &&
      statusUnpause !== "loading" &&
      statusSafeMintWait !== "loading" &&
      statusBurnWait !== "loading" &&
      statusApproveWait !== "loading" &&
      statusTransferOwnershipWait !== "loading" &&
      statusRenounceOwnershipWait !== "loading" &&
      statusTransferFromWait !== "loading" &&
      statusPauseWait !== "loading" &&
      statusUnpauseWait !== "loading"
    ) {
      if (disabled) setDisabled(false);
      setInput({ from: "", to: "", URI: "", tokenId: "", interfaceId: "" });
    }
    // eslint-disable-next-line
  }, [
    statusSafeMint,
    statusBurn,
    statusApprove,
    statusTransferOwnership,
    statusRenounceOwnership,
    statusTransferFrom,
    statusPause,
    statusUnpause,
    statusSafeMintWait,
    statusBurnWait,
    statusApproveWait,
    statusTransferOwnershipWait,
    statusRenounceOwnershipWait,
    statusTransferFromWait,
    statusPauseWait,
    statusUnpauseWait,
  ]);

  // handleSafeMint
  const handleSafeMint = (e) => {
    e.preventDefault();
    if (input.URI && input.URI !== "") {
      let localTo = "";
      if (input.to && input.to !== "" && utils.isAddress(input.to)) {
        localTo = utils.getAddress(input.to);
      } else {
        localTo = account?.address;
      }
      setDisabled(true);
      writeSafeMint({
        args: [localTo, input.URI],
      });
    } else {
      setIsErrorInput({ ...isErrorInput, URI: true });
    }
  };

  // handleBurn
  const handleBurn = (e) => {
    e.preventDefault();
    if (input.tokenId && input.tokenId !== "" && parseInt(input.tokenId) >= 0) {
      setDisabled(true);
      writeBurn({
        args: [parseInt(input.tokenId)],
      });
    } else {
      setIsErrorInput({ ...isErrorInput, tokenId: true });
    }
  };

  // handleApprove
  const handleApprove = (e) => {
    e.preventDefault();
    if (input.tokenId && input.tokenId !== "" && parseInt(input.tokenId) >= 0) {
      if (input.to && utils.isAddress(input.to)) {
        const formattedAddress = utils.getAddress(input.to);
        setDisabled(true);
        writeApprove({
          args: [formattedAddress, parseInt(input.tokenId)],
        });
      } else {
        setIsErrorInput({ ...isErrorInput, to: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, tokenId: true });
    }
  };

  // handleTransferOwnership
  const handleTransferOwnership = (e) => {
    e.preventDefault();
    if (input.to && utils.isAddress(input.to)) {
      setDisabled(true);
      writeTransferOwnership({
        args: [utils.getAddress(input.to)],
      });
    } else {
      setIsErrorInput({ ...isErrorInput, to: true });
    }
  };

  // handleRenounceOwnership
  const handleRenounceOwnership = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeRenounceOwnership();
  };

  // handleTransferFrom  safeTransferFrom(address from, address to, uint256 tokenId)
  const handleTransferFrom = (e) => {
    e.preventDefault();
    let formattedFrom;
    if (input.from && input.from !== "" && utils.isAddress(input.from)) {
      formattedFrom = utils.getAddress(input.from);
    } else {
      formattedFrom = account?.address;
    }
    if (input.to && input.to !== "" && utils.isAddress(input.to)) {
      const formattedTo = utils.getAddress(input.to);
      if (
        input.tokenId &&
        input.tokenId !== "" &&
        parseInt(input.tokenId) >= 0
      ) {
        const formattedTokenId = BigNumber.from(input.tokenId);
        setDisabled(true);
        writeTransferFrom({
          args: [formattedFrom, formattedTo, formattedTokenId],
        });
      } else {
        setIsErrorInput({ ...isErrorInput, tokenId: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, to: true });
    }
  };

  // handlePause
  const handlePause = (e) => {
    e.preventDefault();
    setDisabled(true);
    writePause();
  };

  // handleUnpause
  const handleUnpause = (e) => {
    e.preventDefault();
    setDisabled(true);
    writeUnpause();
  };

  const handleInputTo = (e) => {
    setInput({ ...input, to: e.target.value });
    if (isErrorInput.to) setIsErrorInput({ ...isErrorInput, to: false });
  };
  const handleInputURI = (e) => {
    setInput({ ...input, URI: e.target.value });
    if (isErrorInput.URI) setIsErrorInput({ ...isErrorInput, URI: false });
  };

  const handleInputFrom = (e) => {
    setInput({ ...input, from: e.target.value });
    if (isErrorInput.from) setIsErrorInput({ ...isErrorInput, from: false });
  };
  const handleTokenId = (e) => {
    setInput({ ...input, tokenId: e.target.value });
    if (isErrorInput.tokenId)
      setIsErrorInput({ ...isErrorInput, tokenId: false });
  };

  if (!isMounted) return <></>;
  return (
    <Paper elevation={4}>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={0}
        padding={1}
      >
        <Typography variant="h6" gutterBottom component="div">
          {name}, Address : {nftAddress}
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          Owner: {nftOwner ? nftOwner : constants.AddressZero}, Total Supply:{" "}
          {totalSupply?.toString()} {symbol}
        </Typography>

        <Typography color={isOwner ? "blue" : "text.primary"}>
          Connected: {account?.address} {isOwner && <>(NFT owner)</>}
        </Typography>
        <Typography>
          Balance: {balanceOf?.toString()} {symbol}
        </Typography>
        {parseInt(balanceOf?.toString()) > 0 && (
          <FormControl>
            <FormLabel id="nfts" error={isErrorInput.tokenId}>
              NFTs
            </FormLabel>
            <RadioGroup
              aria-labelledby="nfts"
              name="tokenId"
              value={input.tokenId}
              onChange={handleTokenId}
            >
              {nftArray.map((idx) => {
                return (
                  <GetNFT
                    key={idx}
                    nftAddress={nftAddress}
                    nftABI={nftABI}
                    account={account}
                    isEnabled={isEnabled}
                    index={idx}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        )}

        <TextField
          error={isErrorInput.to}
          autoFocus
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="dense"
          label="Address To? (for mint,transfer..)(empty if current)"
          size="small"
          value={input.to}
          onChange={handleInputTo}
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.URI}
          fullWidth
          helperText="Please enter a valid URI"
          variant="standard"
          type="text"
          margin="dense"
          label="URI"
          size="small"
          value={input.URI}
          onChange={handleInputURI}
          disabled={disabled}
        />
        <TextField
          error={isErrorInput.from}
          fullWidth
          helperText="Please enter a valid ETH address"
          variant="standard"
          type="text"
          margin="dense"
          label="Address From? (empty if current)"
          size="small"
          value={input.from}
          onChange={handleInputFrom}
          disabled={disabled}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        {isOwner && (
          <Button
            variant="contained"
            size="small"
            onClick={handleSafeMint}
            disabled={disabled}
            startIcon={<GetStatusIcon status={statusSafeMint} />}
            endIcon={<GetStatusIcon status={statusSafeMintWait} />}
          >
            mint
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={handleBurn}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusBurn} />}
          endIcon={<GetStatusIcon status={statusBurnWait} />}
        >
          burn
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleApprove}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusApprove} />}
          endIcon={<GetStatusIcon status={statusApproveWait} />}
        >
          approve
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleTransferFrom}
          disabled={disabled}
          startIcon={<GetStatusIcon status={statusTransferFrom} />}
          endIcon={<GetStatusIcon status={statusTransferFromWait} />}
        >
          transfer from
        </Button>
        {isOwner && (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={handlePause}
              disabled={disabled}
              startIcon={<GetStatusIcon status={statusPause} />}
              endIcon={<GetStatusIcon status={statusPauseWait} />}
            >
              pause
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleUnpause}
              disabled={disabled}
              startIcon={<GetStatusIcon status={statusUnpause} />}
              endIcon={<GetStatusIcon status={statusUnpauseWait} />}
            >
              unpause
            </Button>
          </>
        )}
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        {isOwner && (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={handleTransferOwnership}
              disabled={disabled}
              startIcon={<GetStatusIcon status={statusTransferOwnership} />}
              endIcon={<GetStatusIcon status={statusTransferOwnershipWait} />}
            >
              transfer ownership
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleRenounceOwnership}
              disabled={disabled}
              startIcon={<GetStatusIcon status={statusRenounceOwnership} />}
              endIcon={<GetStatusIcon status={statusRenounceOwnershipWait} />}
            >
              renounce ownership
            </Button>
          </>
        )}
      </Stack>
      {isErrorSafeMint && (
        <ShowError
          message="SafeMint:"
          flag={isErrorSafeMint}
          error={errorSafeMint}
        />
      )}
      {isErrorBurn && (
        <ShowError message="Burn:" flag={isErrorBurn} error={errorBurn} />
      )}
      {isErrorApprove && (
        <ShowError
          message="Approve:"
          flag={isErrorApprove}
          error={errorApprove}
        />
      )}
      {isErrorTransferOwnership && (
        <ShowError
          message="Transfer Ownership:"
          flag={isErrorTransferOwnership}
          error={errorTransferOwnership}
        />
      )}
      {isErrorRenounceOwnership && (
        <ShowError
          message="Renounce Ownership:"
          flag={isErrorRenounceOwnership}
          error={errorRenounceOwnership}
        />
      )}
      {isErrorTransferFrom && (
        <ShowError
          message="Transfer From:"
          flag={isErrorTransferFrom}
          error={errorTransferFrom}
        />
      )}
      {isErrorPause && (
        <ShowError message="Pause:" flag={isErrorPause} error={errorPause} />
      )}
      {isErrorUnpause && (
        <ShowError
          message="Unpause:"
          flag={isErrorUnpause}
          error={errorUnpause}
        />
      )}
    </Paper>
  );
};

const GetNFT = ({ nftAddress, nftABI, account, isEnabled, index }) => {
  const isMounted = useIsMounted();
  const {
    data: nft,
    isLoading: isLoadingNFT,
    isError: isErrorNFT,
    error: errorNFT,
    status: statusNFT,
    refetch: refetchTokenOfOwnerByIndex,
  } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "tokenOfOwnerByIndex",
    {
      args: [account?.address, index],
      watch: isEnabled,
      enabled: isEnabled,
    }
  );
  const {
    data: tokenURI,
    isLoading: isLoadingTokenURI,
    isError: isErrorTokenURI,
    error: errorTokenURI,
    status: statusTokenURI,
    refetch: refetchTokenURI,
  } = useContractRead(
    {
      addressOrName: nftAddress,
      contractInterface: nftABI,
    },
    "tokenURI",
    {
      args: [nft ? nft : 0],
      watch: isEnabled,
      enabled: Boolean(isEnabled && nft && !isLoadingNFT && !isErrorNFT),
    }
  );
  useEffect(() => {
    refetchTokenOfOwnerByIndex();
    refetchTokenURI();
  }, []);

  if (
    !isMounted ||
    isLoadingNFT ||
    isErrorNFT ||
    isLoadingTokenURI ||
    isErrorTokenURI
  )
    return <></>;
  return (
    <FormControlLabel
      key={index}
      value={nft.toString()}
      control={<Radio />}
      label={nft.toString() + ":" + tokenURI}
    />
  );
};

export default MyNFT;
