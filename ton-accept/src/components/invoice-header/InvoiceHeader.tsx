import React from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import storeDefaultIcon from "../../img/store.png";

type InvoiceHeaderProps = {
  lineWidth: number;
  children?: string;
  storeName?: string;
  storeAddress?: string;
  storeIcon?: string;
  orderId: number;
  isError?: boolean;
  isSuccess?: boolean;
};

const InvoiceHeader = ({
  isError,
  lineWidth,
  children,
  storeName,
  storeAddress,
  storeIcon,
  orderId,
  isSuccess,
}: InvoiceHeaderProps): JSX.Element => {
  return (
    <>
      <div className="store-name">
        <span>Invoice #{orderId}</span>
        <p>
          {children || (
            <>
              Payment to{" "}
              {storeAddress ? (
                <a href={storeAddress}>{storeName || "store"}</a>
              ) : (
                <>{storeName || "store"}</>
              )}
            </>
          )}
        </p>
      </div>
      <div className="store-logo">
        <img src={storeIcon || storeDefaultIcon} alt="store" />
      </div>
      <div
        className={`line${isError ? " error" : ""}${
          isSuccess ? " success" : ""
        }`}
      >
        {isError || isSuccess ? null : (
          <span style={{ width: `${lineWidth}px` }} />
        )}
      </div>
    </>
  );
};

export default InvoiceHeader;
