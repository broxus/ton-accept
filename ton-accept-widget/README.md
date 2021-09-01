# Ton accept

This is a payment widget that allows you to enable payment via [TON Crystal Extension](https://l1.broxus.com/freeton/wallet).
It is added to any site through the connection of the library and the simplest in-page configuration.
The site can trigger a widget pop-up window when it is necessary to accept a payment from a client.

<br />
<br />
<br />

# Contents

- [Ton accept](#ton-accept)
- [Contents](#contents)
- [Getting Started](#getting-started)
- [Supported currencies](#supported-currencies)
- [Configuration](#сonfiguration)
    - [The accepted currencies are indicated in three ways:](#the-accepted-currencies-are-indicated-in-three-ways)
    - [Store metadata](#store-metadata)
    - [Addresses for payment](#addresses-for-payment)
- [Calling a payment](#calling-a-payment)
    - [Conversion via TON Swap](#conversion-via-ton-swap)
    - [Multi-currency prices](#multi-currency-prices)

<br />
<br />
<br />

# Getting Started

<!-- - Install [the widget](https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk) -->
- Set the [widget code](#) on your site. The library of a particular version is connected from the official Broxus repository or downloaded by the merchant to their servers independently:
    \<script src="https://github.com/broxus/..." \/\>
- Write the necessary [configuration](#configuration) and [payment callbacks](#calling-a-payment)
- Add a button that calls the widget to the site.
- That is all. You can accept payments.


<br />
<br />
<br />

# Supported currencies

In the first iteration, coins supported by the TON Crystal wallet are added:
- *TON Crystal*
- *TIP-3/Broxus*

The merchant specifies the specific list of accepted currencies independently in the configuration.

<br />
<br />
<br />

# Configuration

The widget stores a sorted array with the accepted currencies in the config.currencies parameter . In this case, you can specify either as symbolic names of currencies (from [the official list of currencies](https://github.com/broxus/ton-assets/blob/master/manifest.json)), or by specifying the address of the root contract of the token.


<br />

## The accepted currencies are indicated in three ways:

Through direct assignment

    tonaccept.config.currencies = ['TON', 'USDC'];

or by calling the *setCurrencies* method

    tonaccept.config.setCurrencies(['TON', 'USDC']);

or by specifying a REST method that will return a sorted list in the form of a simple sorted JSON array

    tonaccept.config.currenciesRemote = 'https://localhost/currencies';


<br />

## Store metadata

The merchant can set the name and icon of his store:

    tonaccept.config.storeIcon = 'https://localhost/icon';

    tonaccept.config.storeAddress = 'https://localhost/';

    tonaccept.config.storeName = 'Megastore';

This data will be displayed on the widget.

<br />

## Addresses for payment

The merchant can specify one or more addresses for accepting payments:

    tonaccept.addresses.push('0:...');

If you specify several addresses, the specific one at the time of payment will be selected randomly.


<br />
<br />
<br />

# Calling a payment

<br />

## Conversion via [TON Swap](https://tonswap.io/)

The merchant can call the payment window using the following method:

    tonaccept.requestPayment(orderId, description, amount, [currency], [validUntilUtc], [onSuccess], [onFailure]);

By default, all payments are denominated in USDT, unless an alternative currency is specified. If an alternative currency is specified, then if it is available on TON Swap in a pair to WTON, then an attempt will be made to search for rates to the other accepted currencies. If it is not available, the widget will display only it.

Upon successful completion of the payment, the callback specified in onSuccess is called, and the hash of the transaction is passed to it. If the widget window is closed
or the payment is unsuccessful, onFailure is called .


<br />

## Multi-currency prices

Alternatively, if the product is denominated in several currencies, you can use the following method:

    let price = new Map();
    price.set('TON', 100);
    price.set('USDC', 40);

    tonaccept.requestMultiCurPayment(orderId, description, price, baseCurrency, [validUntilUtc], [onSuccess], [onFailure]);

**In the case of specifically specified multi-currency prices, auto-conversion via TON Swap is not carried out!**

