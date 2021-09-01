/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import AmountBox from "../amount-box/AmountBox";
import InvoiceHeader from "../invoice-header/InvoiceHeader";

type ConnectProps = {
  storeName?: string;
  storeAddress?: string;
  storeIcon?: string;
  orderId: number;
  description: string;
  amount: number;
  onCancel: () => void;
  onConnect: () => void;
};

const Connect = ({
  storeName,
  storeAddress,
  storeIcon,
  orderId,
  description,
  amount,
  onCancel,
  onConnect,
}: ConnectProps): JSX.Element => {
  return (
    <>
      <div className="invoice">
        <InvoiceHeader
          lineWidth={279}
          orderId={orderId}
          storeAddress={storeAddress}
          storeName={storeName}
          storeIcon={storeIcon}
        />
        <AmountBox amount={amount} description={description} />
      </div>
      <div className="cryptocurrencies with-separator">
        <p>
          TON Accept uses Crystal Wallet extension to connect to FreeTON
          blockchain. Please click Connect wallet and select the account you
          would like to pay from.
        </p>
      </div>
      <div className="buttons">
        <a className="button transparent" onClick={onCancel}>
          Cancel
        </a>
        <a className="button" onClick={onConnect}>
          Connect Crystal Wallet
        </a>
      </div>
    </>
  );
};

export default Connect;
