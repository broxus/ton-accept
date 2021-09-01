/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import AmountBox from "../amount-box/AmountBox";
import InvoiceHeader from "../invoice-header/InvoiceHeader";

type WaitingProps = {
  storeIcon?: string;
  orderId: number;
  description: string;
  amount: number;
  onCancel: () => void;
  onRetry: () => void;
};

const Waiting = ({
  storeIcon,
  orderId,
  description,
  amount,
  onCancel,
  onRetry,
}: WaitingProps): JSX.Element => {
  return (
    <>
      <div className="invoice">
        <InvoiceHeader lineWidth={279} orderId={orderId} storeIcon={storeIcon}>
          Waiting for payment
        </InvoiceHeader>
        <AmountBox amount={amount} description={description} />
      </div>
      <div className="cryptocurrencies with-separator">
        <div className="subtitle">
          <span>Please confirm payment in your Crystal Wallet</span>
        </div>
        <p>
          You shall now see the popup window of Crystal Wallet asking you to
          confirm the payment.
        </p>
        <p>If you don’t see the window, click the Retry button below.</p>
      </div>
      <div className="buttons">
        <a className="button transparent" onClick={onCancel}>
          Cancel
        </a>
        <a className="button" onClick={onRetry}>
          Retry to connect
        </a>
      </div>
    </>
  );
};

export default Waiting;
