/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { CurrencyPriceBox } from "../../App";
import AmountBox from "../amount-box/AmountBox";
import InvoiceHeader from "../invoice-header/InvoiceHeader";

import { general } from "./slider";

type PayProps = {
  isSkeleton: boolean;
  storeName?: string;
  storeAddress?: string;
  storeIcon?: string;
  orderId: number;
  description: string;
  amount: number;
  currencies: CurrencyPriceBox[];
  onCancel: () => void;
  onPay: (currency: string, currencyAddress: string) => void;
};

const Pay = ({
  isSkeleton,
  storeName,
  storeAddress,
  storeIcon,
  orderId,
  description,
  amount,
  currencies,
  onCancel,
  onPay,
}: PayProps): JSX.Element => {
  const [currency, setCurrency] = useState(currencies[0]?.currency);
  const [currencyAddress, setCurrencyAddress] = useState(
    currencies[0]?.currencyAddress
  );

  const onCurrencyBoxClick = (item: CurrencyPriceBox) => {
    setCurrency(item.currency);
    setCurrencyAddress(item.currencyAddress);
  };

  const [cur3Arr, setCur3Arr] = useState<JSX.Element[][]>([]);

  useEffect(() => {
    if (!isSkeleton) {
      setCur3Arr(
        currencies.reduce((s, item, i) => {
          if (i % 3 === 0) s.push([]);
          s[s.length - 1].push(
            <div
              key={item.currency}
              className="currency"
              onClick={() => onCurrencyBoxClick(item)}
            >
              <div className="description-logo">
                <div className="description">
                  <div className="name with-tooltip">
                    <span>
                      {item.currency.slice(0, 4) +
                        (item.currency.length > 4 ? "..." : "")}
                    </span>
                    <div className="hidden-text">{item.currency}</div>
                  </div>
                  <div className="type">{item.label}</div>
                </div>
                <div className="logo">
                  <img src={item.logo} alt="currency" />
                </div>
              </div>
              <div className="number with-tooltip">
                <span>{item.amount}</span>
                <div className="hidden-text">{`${item.amount}`}</div>
              </div>
            </div>
          );
          return s;
        }, [] as JSX.Element[][])
      );
    }
  }, [isSkeleton]);

  useEffect(() => {
    if (cur3Arr.length) general();
  }, [cur3Arr.length]);

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
        <div className="subtitle">
          <span style={isSkeleton ? { display: "none" } : {}}>
            Select the payment cryptocurrency
          </span>
          <div
            className="slider-nav"
            style={isSkeleton ? { display: "none" } : {}}
          >
            <div className="count">{}</div>
            <div className="prev">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  // eslint-disable-next-line max-len
                  d="M0.792893 11.7071C0.402369 11.3166 0.402369 10.6834 0.792893 10.2929L5.08579 6L0.792893 1.70711C0.402368 1.31658 0.402368 0.683417 0.792893 0.292893C1.18342 -0.0976315 1.81658 -0.0976315 2.20711 0.292893L7.20711 5.29289C7.59763 5.68342 7.59763 6.31658 7.20711 6.70711L2.20711 11.7071C1.81658 12.0976 1.18342 12.0976 0.792893 11.7071Z"
                  fill="#96A1A7"
                />
              </svg>
            </div>
            <div className="next">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  // eslint-disable-next-line max-len
                  d="M0.792893 11.7071C0.402369 11.3166 0.402369 10.6834 0.792893 10.2929L5.08579 6L0.792893 1.70711C0.402368 1.31658 0.402368 0.683417 0.792893 0.292893C1.18342 -0.0976315 1.81658 -0.0976315 2.20711 0.292893L7.20711 5.29289C7.59763 5.68342 7.59763 6.31658 7.20711 6.70711L2.20711 11.7071C1.81658 12.0976 1.18342 12.0976 0.792893 11.7071Z"
                  fill="#96A1A7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="currencies">
          <div className="slide show">
            {isSkeleton ? (
              <>
                <div className="currency">
                  <div className="description">
                    <div className="name">
                      <span />
                    </div>
                    <div className="type" />
                  </div>
                  <div className="logo" />
                  <div className="number">
                    <span />
                  </div>
                </div>
                <div className="currency">
                  <div className="description">
                    <div className="name">
                      <span />
                    </div>
                    <div className="type" />
                  </div>
                  <div className="logo" />
                  <div className="number">
                    <span />
                  </div>
                </div>
                <div className="currency">
                  <div className="description">
                    <div className="name">
                      <span />
                    </div>
                    <div className="type" />
                  </div>
                  <div className="logo" />
                  <div className="number">
                    <span />
                  </div>
                </div>
              </>
            ) : (
              <>{cur3Arr[0]}</>
            )}
          </div>
          <>
            {cur3Arr.slice(1).map((item, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="slide">
                {item}
              </div>
            ))}
          </>
        </div>
      </div>
      <div className="buttons">
        <a className="button transparent" onClick={onCancel}>
          Cancel
        </a>
        <a className="button" onClick={() => onPay(currency, currencyAddress)}>
          Pay
        </a>
      </div>
    </>
  );
};

export default Pay;
