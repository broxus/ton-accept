import ton, { Address, Subscriber } from "ton-inpage-provider";
import { RootTokenContractV4 } from "../../abi/RootTokenContractV4";
import { TONTokenWalletV4 } from "../../abi/TONTokenWalletV4";

export const sendTon = async ({
  from,
  to,
  amount,
  onSuccess,
}: {
  from: string;
  to: string;
  amount: number;
  onSuccess: (hash: string) => void;
}): Promise<void> => {
  const { transaction } = await ton.rawApi.sendMessage({
    sender: from,
    recipient: to,
    amount: String(Math.round(amount * 1000000000)),
    bounce: false,
  });
  onSuccess(transaction.id.hash);
};

export const sendTip3 = async ({
  from,
  to,
  amount,
  currencyAddress,
  onSuccess,
  onEnd,
}: {
  from: string;
  to: string;
  amount: number;
  currencyAddress: string;
  onSuccess: (hash: any) => void;
  onEnd: () => void;
}): Promise<void> => {
  const { output: output1 } = await ton.rawApi.runLocal({
    address: currencyAddress,
    functionCall: {
      abi: RootTokenContractV4,
      method: "getWalletAddress",
      params: {
        _answer_id: 1, // ?
        wallet_public_key_: "0",
        owner_address_: from,
      },
    },
  });
  const walletAddress1 = output1 && String(output1?.value0);

  const { output: output2 } = await ton.rawApi.runLocal({
    address: currencyAddress,
    functionCall: {
      abi: RootTokenContractV4,
      method: "getWalletAddress",
      params: {
        _answer_id: 1, // ?
        wallet_public_key_: "0",
        owner_address_: to,
      },
    },
  });
  const walletAddress2 = output2 && String(output2?.value0);

  const { output: decimalsOutput } = await ton.rawApi.runLocal({
    address: currencyAddress,
    functionCall: {
      abi: RootTokenContractV4,
      method: "decimals",
      params: {},
    },
  });
  const decimals = decimalsOutput?.decimals;

  if (walletAddress1 && walletAddress2 && decimals) {
    const sub = new Subscriber(ton);

    let isDeployed = true;
    try {
      await ton.rawApi.runLocal({
        address: walletAddress2,
        functionCall: {
          abi: TONTokenWalletV4,
          method: "getDetails",
          params: {
            _answer_id: 1, // ?
          },
        },
      });
    } catch (error) {
      if (
        error.code === 2 &&
        (error.message === "runLocal: Account not found" ||
          error.message === "runLocal: Account is not deployed")
      )
        isDeployed = false;
      else throw error;
    }

    const deploy_grams = 100000000;
    const transfer_grams = 100000000;

    await ton.rawApi.sendMessage({
      sender: from,
      recipient: walletAddress1,
      amount: String(
        0.05 * 1000000000 * 2 + (isDeployed ? 0 : deploy_grams) + transfer_grams
      ),
      bounce: false,
      payload: {
        abi: TONTokenWalletV4,
        method: "transferToRecipient",
        params: {
          recipient_public_key: "0",
          recipient_address: to,
          tokens: String(Math.round(amount * 10 ** +decimals)),
          deploy_grams: isDeployed ? "0" : deploy_grams,
          transfer_grams,
          send_gas_to: from,
          notify_receiver: true,
          payload: "",
        },
      },
    });

    await sub.transactions(walletAddress1 as unknown as Address).makeProducer(
      async (data) => {
        if (
          !data.transactions[0].aborted &&
          !data.transactions[0].outMessages[0].bounced
        ) {
          onSuccess(data.transactions[0].id.hash);
        }
        onEnd();
      },
      () => undefined
    );
  }
};
