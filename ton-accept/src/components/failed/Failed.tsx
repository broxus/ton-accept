/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import InvoiceHeader from "../invoice-header/InvoiceHeader";

type FailedProps = {
  orderId: number;
  storeIcon?: string;
  onClose: () => void;
  onGoBack: () => void;
};

const Failed = ({
  orderId,
  storeIcon,
  onClose,
  onGoBack,
}: FailedProps): JSX.Element => {
  return (
    <>
      <div className="invoice">
        <InvoiceHeader
          lineWidth={279}
          orderId={orderId}
          storeIcon={storeIcon}
          isError
        >
          Error
        </InvoiceHeader>
      </div>
      <div className="cryptocurrencies">
        <div className="subtitle">
          <span>The payment has failed</span>
        </div>
        <p>
          Make sure you have sufficient balance to pay in the selected currency,
          enough gas in TON Crystals.
        </p>
        <p>
          Don’t close the Crystal Wallet window until the payment completes.
        </p>
        <p>Click Go back to retry or Close to end the payment session.</p>
      </div>
      <div className="buttons">
        <a className="button transparent" onClick={onClose}>
          Cancel
        </a>
        <a className="button" onClick={onGoBack}>
          Go back
        </a>
      </div>
    </>
  );
};

export default Failed;
