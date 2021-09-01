/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import InvoiceHeader from "../invoice-header/InvoiceHeader";

type SuccessProps = {
  orderId: number;
  storeIcon?: string;
  description: string;
  amount: number;
  currency: string;
  hash: string;
  onClose: () => void;
};

const Success = ({
  orderId,
  storeIcon,
  description,
  amount,
  currency,
  hash,
  onClose,
}: SuccessProps): JSX.Element => {
  const onCopy = () => {
    const input = document.createElement("textarea");
    input.value = hash;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    input.remove();
  };
  return (
    <>
      <div className="invoice">
        <InvoiceHeader
          lineWidth={279}
          orderId={orderId}
          storeIcon={storeIcon}
          isSuccess
        >
          Success
        </InvoiceHeader>
      </div>
      <div className="cryptocurrencies">
        <div className="subtitle">
          <span>Thank you for your payment!</span>
        </div>
        <p>Please find details of your payment below.</p>
        <div className="info">
          <div className="row">
            <div className="label">Status</div>
            <div className="data">Success</div>
          </div>
          <div className="row">
            <div className="label">Order ID</div>
            <div className="data">{orderId}</div>
          </div>
          <div className="row">
            <div className="label">Description</div>
            <div className="data">{description}</div>
          </div>
          <div className="row">
            <div className="label">Amount</div>
            <div className="data">
              {amount} {currency}
            </div>
          </div>
          <div className="row">
            <div className="label">Transaction hash</div>
            <div className="data with-tooltip">
              {`${hash.slice(0, 6)}...${hash.slice(-6)}`}
              <div className="hidden-text centered" id="copy">
                {hash}
              </div>
              <a
                className="external"
                href={`https://tonscan.io/transactions/${hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="24 / basic / external-link">
                    <path
                      id="icon"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      // eslint-disable-next-line max-len
                      d="M7.80279 9.13807L12.6647 4.27614V7.33333H13.9981V2H8.66472V3.33333H11.7219L6.85998 8.19526L7.80279 9.13807ZM12.6667 12.6667V9.33333H11.3333V12.6667H3.33333V4.66667H6.66667V3.33333H3.33333C2.59695 3.33333 2 3.93029 2 4.66667V12.6667C2 13.403 2.59695 14 3.33333 14H11.3333C12.0697 14 12.6667 13.403 12.6667 12.6667Z"
                      fill="#0088CC"
                    />
                  </g>
                </svg>
              </a>
              <a className="copy js-copy" onClick={onCopy}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="24 / basic / copy">
                    <path
                      id="icon"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      // eslint-disable-next-line max-len
                      d="M6.66683 1.33301H13.3335C14.1017 1.33301 14.6668 1.89815 14.6668 2.66634V9.33301C14.6668 10.1012 14.1017 10.6663 13.3335 10.6663H10.6668V13.333C10.6668 14.1012 10.1017 14.6663 9.3335 14.6663H2.66683C1.89864 14.6663 1.3335 14.1012 1.3335 13.333V6.66634C1.3335 5.89815 1.89864 5.33301 2.66683 5.33301H5.3335V2.66634C5.3335 1.89815 5.89864 1.33301 6.66683 1.33301ZM5.3335 6.66634H2.66683V13.333H9.3335V10.6663H6.66683C5.89864 10.6663 5.3335 10.1012 5.3335 9.33301V6.66634ZM6.66683 2.66634V9.33301H13.3335V2.66634H6.66683Z"
                      fill="#0088CC"
                    />
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="buttons">
        <span>It is safe to close the window now.</span>
        <a className="button" onClick={onClose}>
          Close
        </a>
      </div>
    </>
  );
};

export default Success;
