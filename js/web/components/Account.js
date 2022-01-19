import React, { useState, useContext, useEffect } from "react";
import * as anchor from '@project-serum/anchor'
import { useWallet } from "@solana/wallet-adapter-react";
import { useSnackbar } from 'notistack'
import Typography from "@mui/material/Typography";
import ninaCommon from "nina-common";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { WebBundlr } from "@bundlr-network/client/web";
import NinaBox from "./NinaBox";

const { NinaContext } = ninaCommon.contexts
const { NinaClient } = ninaCommon.utils

const Account = () => {
  const wallet = useWallet();
  const { bundlerBalance, getBundlerBalance, bundlerFund, bundlerWithdraw } = useContext(NinaContext);
  const { enqueueSnackbar } = useSnackbar()
  const [fundAmount, setFundAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [uploadBalance, setUploadBalance] = useState();

  useEffect(() => {
    getBundlerBalance()
  }, [])

  useEffect(() => {
    console.log('yo yo: ', bundlerBalance)
    setUploadBalance(bundlerBalance)
  }, [bundlerBalance])

  return (
    <AccountWrapper>
      <NinaBox
        sx={{ backgroundColor: "white" }}
      >
        <div>
          <Typography onClick={() => getBundlerBalance()}>Bundler Balance: {NinaClient.nativeToUiString(
              bundlerBalance,
              new anchor.web3.PublicKey(NinaClient.ids().mints.wsol)
            )}
          </Typography>
          <div>
            <label for="fund">Fund Account:</label>
            <input name="fund" type="text" onChange={(e) => setFundAmount(e.target.value)}/>
            <button onClick={() => bundlerFund(fundAmount)}>Fund</button>
          </div>
          <div>
            <label for="withdraw">Withdraw From Account:</label>
            <input name="withdraw" type="text" onChange={(e) => setWithdrawAmount(e.target.value)}/>
            <button onClick={() => bundlerWithdraw(withdrawAmount)}>Withdraw</button>
          </div>
        </div>
      </NinaBox>
    </AccountWrapper>
  );
};

const AccountWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    overflowX: "scroll",
    padding: "120px 0",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

export default Account;
