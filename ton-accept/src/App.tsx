import React, { useEffect, useState } from "react";
import ton, { hasTonProvider } from "ton-inpage-provider";
import Connect from "./components/connect/Connect";
import Failed from "./components/failed/Failed";
import Mobile from "./components/mobile/Mobile";
import Pay from "./components/pay/Pay";
import Scene from "./components/scene/Scene";
import Success from "./components/success/Success";
import Waiting from "./components/waiting/Waiting";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import defaultCurrencyImg from "./img/default-currency.svg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tonLogo from "./img/TON.svg";
import { GetTokensInfo, getTokensInfo } from "./lib/tokens-info/tokens-info";
import {
  sendTip3,
  sendTon,
} from "./lib/ton-inpage-provider/ton-inpage-provider";
import { getCurrenciesDataInfo } from "./lib/ton-swap/ton-swap";

type Config = {
  currencies: string[];
  currenciesRemote: string;
  storeIcon: string;
  storeAddress: string;
  storeName: string;
};

type RequestPayment = {
  orderId: number;
  description: string;
  amount: number;
  currency: string;
  validUntilUtc: number;
  onSuccess: () => void;
  onFailure: () => void;
};

type RequestMultiCurPayment = {
  orderId: number;
  description: string;
  price: Map<string, number>;
  baseCur: string;
  validUntilUtc: number;
  onSuccess: () => void;
  onFailure: () => void;
};

export type CurrencyPriceBox = {
  currency: string;
  amount: number;
  label: string;
  currencyAddress: string;
  logo: string;
};

function App(): JSX.Element {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successCurrency, setSuccessCurrency] = useState("TON");
  const [successAmount, setSuccessAmount] = useState(0);

  const [config, setConfig] = useState<Config | null>(null);
  const [addresses, setAddresses] = useState<string[] | null>(null);
  const [requestPayment, setRequestPayment] = useState<RequestPayment | null>(
    null
  );
  const [requestMultiCurPayment, setRequestMultiCurPayment] =
    useState<RequestMultiCurPayment | null>(null);

  const [currencies, setCurrencies] = useState<string[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSkeleton, setIsSkeleton] = useState(true);

  const [balance, setBalance] = useState("");

  const getCurrenciesRemote = async (currenciesRemote: string) => {
    const response = await fetch(currenciesRemote);
    if (response.ok) {
      return response.json();
    }
    // eslint-disable-next-line no-console
    console.error(`getCurrenciesRemote error: ${response.status}`);
    return null;
  };

  const [orderId, setOrderId] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  const [hash, setHash] = useState<string | null>(null);

  const [currencyPriceBox, setCurrencyPriceBox] = useState<
    CurrencyPriceBox[] | null
  >(null);

  const [tokensInfo, setTokensInfo] = useState<GetTokensInfo | null>(null);

  const [retryData, setRetryData] = useState<{
    currencyCode: string;
    currencyAddress: string;
  } | null>(null);

  const [notInstalled, setNotInstalled] = useState(true);

  const onSuccess = () => {
    window.parent.postMessage(
      {
        command: "success",
        hash,
      },
      "*"
    );
  };

  const onFailure = () => {
    window.parent.postMessage(
      {
        command: "failure",
        hash,
      },
      "*"
    );
  };

  const validUntilUtcTimer = (validUntilUtc: number) => {
    setTimeout(() => onFailure(), validUntilUtc - Date.now());
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      switch (e.data.command) {
        case "setRequestPayment":
          if (e.data.request.validUntilUtc)
            validUntilUtcTimer(e.data.request.validUntilUtc);
          setRequestPayment(e.data.request);
          setConfig(e.data.config);
          setAddresses(e.data.addresses);
          break;
        case "setRequestMultiCurPayment":
          if (e.data.request.validUntilUtc)
            validUntilUtcTimer(e.data.request.validUntilUtc);
          setRequestMultiCurPayment(e.data.request);
          setConfig(e.data.config);
          setAddresses(e.data.addresses);
          break;
        default:
          break;
      }
    });
  }, []);

  const hasProvider = async () => {
    if (!(await hasTonProvider())) {
      // eslint-disable-next-line no-alert
      alert("TON Crystal Wallet is not installed");
      onFailure();
      throw new Error("TON Crystal Wallet is not installed");
    } else {
      setNotInstalled(false);
    }
  };

  useEffect(() => {
    hasProvider();
  }, []);

  async function init() {
    await ton.ensureInitialized();

    const { accountInteraction } = await ton.rawApi.requestPermissions({
      permissions: ["tonClient", "accountInteraction"],
    });
    if (accountInteraction == null) {
      throw new Error("Insufficient permissions");
    } else {
      setSelectedAddress(accountInteraction.address);
      setBalance(
        (
          await ton.getFullContractState({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            address: accountInteraction.address,
          })
        )?.state?.balance || ""
      );
    }
  }

  const payment = async () => {
    if (requestMultiCurPayment) {
      if (requestMultiCurPayment.orderId)
        setOrderId(requestMultiCurPayment.orderId);
      if (requestMultiCurPayment.description)
        setDescription(requestMultiCurPayment.description);
      if (requestMultiCurPayment.price) {
        const box = Array.from(requestMultiCurPayment.price.entries())
          .map((item) => ({
            currency: item[0],
            amount: item[1],
            label: item[0] === "TON" ? "Native" : "TIP-3",
            currencyAddress:
              item[0].slice(0, 2) === "0:" && !Number.isNaN(+item[0].slice(2))
                ? item[0]
                : tokensInfo?.tokens.find((token) => token.symbol === item[0])
                    ?.address || "",
            logo:
              item[0] === "TON"
                ? tonLogo
                : tokensInfo?.tokens.find((token) => token.symbol === item[0])
                    ?.logoURI || "",
          }))
          .map((item) => {
            if (
              item.currency.slice(0, 2) === "0:" &&
              !Number.isNaN(item.currency.slice(2))
            ) {
              return {
                ...item,
                currency:
                  tokensInfo?.tokens.find((t) => t.address === item.currency)
                    ?.symbol || item.currency,
                logo:
                  tokensInfo?.tokens.find((t) => t.address === item.currency)
                    ?.logoURI || defaultCurrencyImg,
              };
            }
            return item;
          });
        setCurrencyPriceBox(box);
        const CUR = requestMultiCurPayment.baseCur;
        try {
          setAmount(box.find((item) => item.currency === CUR)?.amount || 0);
          setCurrency(CUR);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        setLoading(false);
      }
    } else if (requestPayment && currencies) {
      if (requestPayment.orderId) setOrderId(requestPayment.orderId);
      if (requestPayment.description)
        setDescription(requestPayment.description);
      if (requestPayment.amount) setAmount(requestPayment.amount);
      let cur: string | undefined = requestPayment.currency;
      if (cur) {
        cur =
          cur.slice(0, 2) === "0:"
            ? tokensInfo?.tokens.find((item) => item.address === cur)?.symbol
            : cur;
        if (cur) await setCurrency(cur);
        else {
          throw Error("Invalid currency in requestPayment");
        }
      }

      let currenciesDataInfo: {
        code: string;
        price: number;
        address: string;
      }[];

      const curToWtonArr = await getCurrenciesDataInfo(
        cur,
        tokensInfo?.tokens.find((item) => item.symbol === cur)?.address || "",
        ["WTON"]
      );

      const curToWton = curToWtonArr ? curToWtonArr[0].price : null;

      if (curToWton && curToWtonArr?.[0]) {
        if (cur && cur !== "USDT") {
          currenciesDataInfo =
            (
              await getCurrenciesDataInfo(
                "WTON",
                tokensInfo?.tokens.find((item) => item.symbol === "WTON")
                  ?.address || "",
                currencies
              )
            )
              ?.map((item) => ({
                ...item,
                price: item.price * curToWton,
              }))
              .concat(curToWtonArr[0]) || [];
        } else {
          const info1 =
            (await getCurrenciesDataInfo(
              cur || "USDT",
              tokensInfo?.tokens.find((item) => item.symbol === cur)?.address ||
                "",
              currencies.map((item) => (item === "TON" ? "WTON" : item))
            )) || [];
          const info2 =
            (
              await getCurrenciesDataInfo(
                "WTON",
                tokensInfo?.tokens.find((item) => item.symbol === "WTON")
                  ?.address || "",
                currencies.filter((item) => !info1.find((c) => c.code === item))
              )
            )
              ?.map((item) => ({
                ...item,
                price: item.price * curToWton,
              }))
              .concat(curToWtonArr[0]) || [];
          currenciesDataInfo = info1.concat(info2);
        }
      }
      if (currencies) {
        const box = currencies
          .map((item) =>
            // eslint-disable-next-line no-nested-ternary
            item.slice(0, 2) === "0:" && !Number.isNaN(item.slice(2))
              ? currenciesDataInfo?.find((c) => c.address === item)?.code ||
                (item ===
                tokensInfo?.tokens.find((t) => t.symbol === cur)?.address
                  ? cur
                  : item)
              : item
          )
          .map((item) => {
            const relativePrice = currenciesDataInfo?.find((c) =>
              item === "TON" ? c.code === "WTON" : c.code === item
            )?.price;
            const decimals =
              item === "TON"
                ? 9
                : tokensInfo?.tokens.find((ti) => ti.symbol === item)
                    ?.decimals || 1;
            return {
              currency: item,
              amount:
                // eslint-disable-next-line no-nested-ternary
                item === cur
                  ? requestPayment.amount
                  : relativePrice
                  ? Math.round(
                      requestPayment.amount * relativePrice * 10 ** decimals
                    ) /
                    10 ** decimals
                  : 0,
              label: item === "TON" ? "Native" : "TIP-3",
              currencyAddress:
                tokensInfo?.tokens.find((token) => token.symbol === item)
                  ?.address || "",
              logo:
                item === "TON"
                  ? tonLogo
                  : tokensInfo?.tokens.find((token) => token.symbol === item)
                      ?.logoURI || defaultCurrencyImg,
            };
          })
          .filter((item) => {
            const condition = item.currency?.slice(0, 2) === "0:";
            if (condition)
              // eslint-disable-next-line no-console
              console.error(`${item.currency} is not correct currency address`);
            return !condition;
          })
          .filter(
            (item) =>
              item.amount !== Infinity &&
              item.amount !== -Infinity &&
              item.amount !== 0
          );
        setCurrencyPriceBox(box as CurrencyPriceBox[]);
        setLoading(false);
      }
    } else {
      throw Error();
    }
  };

  const currenciesCheck = async (cur: string[]) => {
    const info = await getTokensInfo();
    setCurrencies(
      cur.filter((c) => {
        const find = !!info?.tokens.find((item: any) => item.symbol === c);
        const custom = c.slice(0, 2) === "0:" && !Number.isNaN(c.slice(2));
        if (!find && c !== "TON" && !custom)
          // eslint-disable-next-line no-console
          console.error(`"${c}" is not correct currency symbol`);
        return c === "TON" || custom || find;
      })
    );
    setTokensInfo(info);
  };
  let set = true;
  useEffect(() => {
    if (
      set &&
      config &&
      addresses &&
      (requestPayment || requestMultiCurPayment)
    ) {
      set = false;
      if (config.currencies && config.currencies.length < 1) {
        if (config.currenciesRemote) {
          getCurrenciesRemote(config.currenciesRemote)
            .then((c) => {
              currenciesCheck(c);
            })
            // eslint-disable-next-line no-console
            .catch((e) => console.error(e));
        } else {
          // eslint-disable-next-line no-console
          console.error("no currencies");
        }
      } else if (requestMultiCurPayment?.price) {
        currenciesCheck(
          Array.from(requestMultiCurPayment.price).map((item) => item[0])
        );
      } else if (config.currencies) {
        currenciesCheck(config.currencies);
      } else {
        // eslint-disable-next-line no-console
        console.error("no currencies");
      }
    }
  }, [config, addresses, requestPayment, requestMultiCurPayment]);

  useEffect(() => {
    if (!requestPayment) return;
    const token = tokensInfo?.tokens.find(
      (item) => item.symbol === requestPayment?.currency
    );
    if (!token) return;
    if (
      Math.round(requestPayment.amount * 10 ** token.decimals) /
        token.decimals ===
      0
    ) {
      setNotInstalled(true);
      // eslint-disable-next-line no-console
      console.error("the price in the base currency is too small");
      onFailure();
    }
  }, [tokensInfo]);

  useEffect(() => {
    if (tokensInfo) {
      payment();
    }
  }, [tokensInfo]);

  const onPay = async (currencyCode: string, currencyAddress: string) => {
    setIsPaymentStart(true);
    const amountInChooseCurrency = currencyPriceBox?.find(
      (item) => item.currency === currencyCode
    )?.amount;
    if (addresses && selectedAddress && amountInChooseCurrency) {
      const randomAddress =
        addresses[Math.floor(Math.random() * addresses.length)];
      try {
        if (currencyCode === "TON") {
          await sendTon({
            from: selectedAddress,
            to: randomAddress,
            amount: amountInChooseCurrency,
            onSuccess: (h) => {
              setHash(h);
              setIsSuccess(true);
              setIsTheEnd(true);
            },
          });
        } else {
          await sendTip3({
            from: selectedAddress,
            to: randomAddress,
            amount: amountInChooseCurrency,
            currencyAddress,
            onSuccess: (h) => {
              setHash(h);
              setIsSuccess(true);
            },
            onEnd: () => setIsTheEnd(true),
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (error.message !== "The request was rejected; please try again") {
          setIsTheEnd(true);
        } else {
          setRetryData({
            currencyCode,
            currencyAddress,
          });
        }
      } finally {
        setSuccessCurrency(currencyCode);
        setSuccessAmount(amountInChooseCurrency);
        setBalance(
          (
            await ton.getFullContractState({
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              address: selectedAddress,
            })
          )?.state?.balance || ""
        );
      }
    }
  };

  const onCancel = () => {
    setIsConnected(false);
  };

  const onConnect = () => {
    setIsSkeleton(true);
    setIsConnected(true);
    init()
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setIsConnected(false);
      })
      .then(() => setIsSkeleton(false));
  };

  const onRetry = () => {
    if (
      retryData?.currencyCode === "TON" ||
      (retryData?.currencyCode && retryData?.currencyAddress)
    ) {
      onPay(retryData.currencyCode, retryData.currencyAddress);
    }
  };

  const onGoBack = () => {
    setIsPaymentStart(false);
    setIsTheEnd(false);
    setIsSuccess(false);
  };

  useEffect(() => {
    if (!isConnected) {
      ton.disconnect();
      setIsTheEnd(false);
      setIsPaymentStart(false);
      setIsSuccess(false);
    }
  }, [isConnected]);

  if (loading) return <></>;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return (
      <Mobile
        orderId={orderId || 0}
        storeAddress={config?.storeAddress}
        storeName={config?.storeName}
        storeIcon={config?.storeIcon}
        onClose={onFailure}
      />
    );
  }

  if (notInstalled) return <></>;

  if (
    amount !== null &&
    currency !== null &&
    orderId !== null &&
    description !== null &&
    currencyPriceBox !== null &&
    currencyPriceBox.length >= 1
  )
    return (
      <Scene
        isSkeleton={isSkeleton}
        isConnected={isConnected}
        amount={+balance / 1000000000} // TON
        currency="TON"
        address={selectedAddress || ""}
        onExit={onCancel}
        onConnect={onConnect}
      >
        <>
          {!isConnected && (
            <Connect
              storeName={config?.storeName}
              storeAddress={config?.storeAddress}
              storeIcon={config?.storeIcon}
              orderId={orderId}
              description={description}
              amount={amount}
              onCancel={onFailure}
              onConnect={onConnect}
            />
          )}
          {isConnected &&
            !isTheEnd &&
            (!isPaymentStart ? (
              <Pay
                isSkeleton={isSkeleton}
                storeName={config?.storeName}
                storeAddress={config?.storeAddress}
                storeIcon={config?.storeIcon}
                orderId={orderId}
                description={description}
                amount={amount}
                currencies={currencyPriceBox}
                onCancel={onFailure}
                onPay={onPay}
              />
            ) : (
              <Waiting
                storeIcon={config?.storeIcon}
                orderId={orderId}
                description={description}
                amount={amount}
                onCancel={onFailure}
                onRetry={onRetry}
              />
            ))}
          {isConnected &&
            isTheEnd &&
            (isSuccess ? (
              <Success
                orderId={orderId}
                storeIcon={config?.storeIcon}
                description={description}
                amount={successAmount}
                currency={successCurrency}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                hash={hash!}
                onClose={onSuccess}
              />
            ) : (
              <Failed
                storeIcon={config?.storeIcon}
                orderId={orderId}
                onClose={onFailure}
                onGoBack={onGoBack}
              />
            ))}
        </>
      </Scene>
    );

  return <div>Error</div>;
}

export default App;
