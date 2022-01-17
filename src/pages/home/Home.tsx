import React, { useEffect } from "react";
import { chainMap } from "../../config/chains/chainMap";

import { HiOutlineExternalLink } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";

import { Listbox, Transition } from "@headlessui/react";
import Select from "../../components/Select";
import { useWalletProvider } from "../../context/WalletProvider";
import { useNavigate } from "react-router-dom";
import { useChains } from "../../context/Chains";

import NetworkSelectors from "./components/NetworkSelectors";
import { useToken } from "context/Token";
import TokenSelector from "./components/TokenSelector";
import AmountInput from "./components/AmountInput";
import Navbar from "components/Navbar";
import TransactionFee from "./components/TransactionFee";
import CallToAction from "./components/CallToAction";
import { Toggle } from "components/Toggle";
import PrimaryButtonLight from "components/Buttons/PrimaryButtonLight";
import useModal from "hooks/useModal";
import ApprovalModal from "./components/ApprovalModal";
import Modal from "components/Modal";
import { useTokenApproval } from "context/TokenApproval";
import useErrorModal from "hooks/useErrorModal";
import ErrorModal from "./components/ErrorModal";
import TransferModal from "./components/TransferModal";
import TransferInfoModal from "./components/TransferInfoModal";
import { useTransaction } from "context/Transaction";
import { useBiconomy } from "context/Biconomy";
import { twMerge } from "tailwind-merge";
import CustomTooltip from "./components/CustomTooltip";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { areChainsReady } = useChains()!;
  const { changeTransferAmountInputValue } = useTransaction()!;
  const { selectedTokenBalance } = useToken()!;

  const {
    isBiconomyAllowed,
    isBiconomyToggledOn,
    setIsBiconomyToggledOn,
    isBiconomyEnabled,
  } = useBiconomy()!;

  const navigate = useNavigate();
  const { isLoggedIn, connect } = useWalletProvider()!;

  const {
    isVisible: isApprovalModalVisible,
    hideModal: hideApprovalModal,
    showModal: showApprovalModal,
  } = useModal();

  const {
    isVisible: isTransferModalVisible,
    hideModal: hideTransferlModal,
    showModal: showTransferModal,
  } = useModal();

  const { executeApproveTokenError } = useTokenApproval()!;

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);

  useEffect(() => {
    (async () => {
      await connect().catch((e) => {
        console.error(e);
      });
    })();
  }, [isLoggedIn, navigate, connect]);

  return (
    <div className="h-full w-full flex flex-col">
      <Navbar />
      <ApprovalModal
        isVisible={isApprovalModalVisible}
        onClose={hideApprovalModal}
      />
      <TransferModal
        isVisible={isTransferModalVisible}
        onClose={() => {
          changeTransferAmountInputValue("");
          hideTransferlModal();
        }}
      />
      {/* <TransferInfoModal isVisible={true} onClose={() => null} /> */}
      <ErrorModal error={executeApproveTokenError} title={"Approval Error"} />
      <div className="flex flex-col items-stretch gap-4">
        <span className="flex items-center mt-8 gap-2 mx-auto">
          <span className="flex-shrink-0 text-white font-bold text-xs">
            Powered By
          </span>
          <img
            src={`${process.env.PUBLIC_URL}/biconomy-wordmark.svg`}
            className="h-10"
            alt="Biconomy Logo"
          />
        </span>

        <div className="flex flex-grow">
          <div className="max-w-xl mx-auto flex flex-col flex-grow">
            <div className="relative z-10 flex-grow">
              <div className="absolute opacity-80 inset-2 rounded-3xl bg-hyphen-purple/75 blur-lg -z-10"></div>
              <div className="mx-4 mt-4 min-w-0 bg-white p-6 rounded-3xl flex-grow flex flex-col gap-2 shadow-lg">
                <div className="flex justify-between items-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/hyphen-logo.svg`}
                    className="h-8 m-2 opacity-100"
                    alt="Hyphen Logo"
                  />

                  <div
                    data-tip
                    data-for="whyGaslessDisabled"
                    className={twMerge(
                      "p-1 flex gap-4 items-center",
                      !isBiconomyAllowed && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="text-hyphen-purple-dark/80 font-semibold text-sm uppercase flex items-center gap-2">
                      <FaInfoCircle />
                      <span className="mt-0.5">Go Gasless</span>
                    </span>
                    <Toggle
                      label="Go Gasless:"
                      enabled={isBiconomyEnabled}
                      onToggle={(enabled) => setIsBiconomyToggledOn(enabled)}
                    />
                  </div>
                  {!isBiconomyAllowed && (
                    <CustomTooltip
                      id="whyGaslessDisabled"
                      text="Disabled for selected chain"
                    />
                  )}
                </div>
                <div className="grid grid-cols-[1fr_34px_1fr] gap-2 p-4 rounded-xl bg-hyphen-purple bg-opacity-[0.05] border-hyphen-purple border border-opacity-10 hover:border-opacity-30">
                  <NetworkSelectors />
                </div>
                <div className="grid grid-cols-[244px_1fr] gap-3 p-4 rounded-xl bg-hyphen-purple bg-opacity-[0.05] border-hyphen-purple border border-opacity-10 hover:border-opacity-30">
                  <AmountInput disabled={!areChainsReady} />
                  <TokenSelector disabled={!areChainsReady} />
                </div>
                <CallToAction
                  onApproveButtonClick={showApprovalModal}
                  onTransferButtonClick={showTransferModal}
                />
              </div>
            </div>
            <TransactionFee />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;