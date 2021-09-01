import { baseUrl } from "./baseUrl";

export const getCurrenciesDataInfo = async (
  currency: string,
  currencyAddress: string,
  currencies: string[]
): Promise<
  | {
      code: string;
      price: number;
      address: string;
    }[]
  | null
> => {
  const response = await fetch(`${baseUrl}pairs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currencyAddress,
      limit: 1000,
      offset: 0,
      ordering: "tvlascending",
    }),
  });
  type Response = {
    leftPrice: string;
    rightPrice: string;
    meta: {
      base: string;
      counter: string;
      counterAddress: string;
      baseAddress: string;
    };
  };
  if (response.ok) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ((await response.json()).pairs as Response[])
      .filter((item) =>
        // eslint-disable-next-line no-nested-ternary
        item.meta.base === currency
          ? currencies.find((cur) => {
              if (cur.slice(0, 2) === "0:" && !Number.isNaN(cur.slice(2))) {
                return item.meta.counterAddress === cur;
              }
              return item.meta.counter === cur;
            })
          : item.meta.counter === currency
          ? currencies.find((cur) => {
              if (cur.slice(0, 2) === "0:" && !Number.isNaN(cur.slice(2))) {
                return item.meta.baseAddress === cur;
              }
              return item.meta.base === cur;
            })
          : false
      )
      .map((item) =>
        item.meta.base === currency
          ? {
              code: item.meta.counter,
              price: +item.leftPrice / +item.rightPrice,
              address: item.meta.counterAddress,
            }
          : {
              code: item.meta.base,
              price: +item.rightPrice / +item.leftPrice,
              address: item.meta.baseAddress,
            }
      )
      .filter(
        (item) =>
          item.price !== Infinity &&
          item.price !== -Infinity &&
          item.price !== 0
      );
  }
  return null;
};
