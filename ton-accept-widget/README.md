# Ton accept

This is a payment widget that allows you to enable payment via [TON Crystal Extension](https://l1.broxus.com/freeton/wallet).
It is added to any site through the connection of the library and the simplest in-page configuration.
The site can trigger a widget pop-up window when it is necessary to accept a payment from a client.


# Contents

- [Ton accept](#ton-accept)
- [Contents](#contents)
- [Getting started](#getting-started)
- [Setup example](#setup-example)
- [Supported currencies](#supported-currencies)
- [Configuration](#сonfiguration)
    - [The accepted currencies are indicated in three ways:](#the-accepted-currencies-are-indicated-in-three-ways)
    - [Store metadata](#store-metadata)
    - [Addresses for payment](#addresses-for-payment)
- [Calling a payment](#calling-a-payment)
    - [Conversion via TON Swap](#conversion-via-ton-swap)
    - [Multi-currency prices](#multi-currency-prices)
- [Standalone widget host or How to host widget by myself](#standalone-widget-host-or-how-to-host-widget-by-myself)


# Getting started

<!-- - Install [the widget](https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk) -->
- Set the [widget code](##standalone-widget-host-or-how-to-host-widget-by-myself) on your site. The library of a particular version is connected from the official Broxus repository or [downloaded by the merchant to their servers independently](#standalone-widget-host-or-how-to-host-widget-by-myself). The code includes 2 repositories with the widget code (src) and the layout code (data-src):
    \<script src="https://github.com/broxus/..."  data-src="https://github.com/broxus/..." \/\>
- Write the necessary [configuration](#configuration) and [payment callbacks](#calling-a-payment)
- Add a button that calls the widget to the site.
- That is all. You can accept payments.

# Setup example


```html
<body>
    <script src="https://..." data-src="https://..."></script>
    <script>
        function payment() {
            // Set currencies
                window.tonaccept.config.currencies = ['TON', '0:...'];
                // or
                window.tonaccept.config.currenciesRemote = 'https://...';

            // Add address
            // one address will be randomly selected (each time)
                window.tonaccept.addresses.push('0:...');
                window.tonaccept.addresses.push('0:...');
                window.tonaccept.addresses.push('0:...');
                window.tonaccept.addresses.push('0:...');
                window.tonaccept.addresses.push('0:...');

            // Calling a payment
                // The first option
                    const orderId = 1;
                    const description = 'description';
                    const amount = 0.01;
                    const currency = "USDC";
                    const validUntilUtc = Date.now() + 1000*60*10;
                    const onSuccess = () => console.log('onSuccess');
                    const onFailure = () => console.log('onFailure');
                    window.tonaccept.requestPayment(
                        orderId, description, amount, currency, validUntilUtc, onSuccess, onFailure);

                // or the second option
                    const orderId = 1;
                    const description = 'description';
                    const price = new Map();
                        price.set('TON', 100);
                        price.set('USDT', 40);
                        price.set('0:...', 60);
                    const baseCurrency = "USDC";
                    const validUntilUtc = Date.now() + 1000*60*10;
                    const onSuccess = () => console.log('onSuccess');
                    const onFailure = () => console.log('onFailure');
                    window.tonaccept.requestMultiCurPayment(
                        orderId, description, price, baseCurrency, validUntilUtc, onSuccess, onFailure);
        }

            // Optional
                window.tonaccept.config.storeIcon = 'https://...';
                window.tonaccept.config.storeAddress = 'https://...';
                window.tonaccept.config.storeName = 'My awesome store';

    </script>
    <main>
        <button onclick="payment()">payment</button>
    </main>
</body>
```



# Supported currencies

In the first iteration, coins supported by the TON Crystal wallet are added:
- *TON Crystal*
- *TIP-3/Broxus*

The merchant specifies the specific list of accepted currencies independently in the configuration.


# Configuration

The widget stores a sorted array with the accepted currencies in the config.currencies parameter . In this case, you can specify either as symbolic names of currencies (from [the official list of currencies](https://github.com/broxus/ton-assets/blob/master/manifest.json)), or by specifying the address of the root contract of the token.



## The accepted currencies are indicated in three ways:

Through direct assignment

    tonaccept.config.currencies = ['TON', 'USDC', '0:...'];

or by calling the *setCurrencies* method

    tonaccept.config.setCurrencies(['TON', 'USDC', '0:...']);

or by specifying a REST method that will return a sorted list in the form of a simple sorted JSON array

    tonaccept.config.currenciesRemote = 'https://localhost/currencies';



## Store metadata

The merchant can set the name and icon of his store:

    tonaccept.config.storeIcon = 'https://localhost/icon';

    tonaccept.config.storeAddress = 'https://localhost/';

    tonaccept.config.storeName = 'Megastore';

This data will be displayed on the widget.


## Addresses for payment

The merchant can specify one or more addresses for accepting payments:

    tonaccept.addresses.push('0:...');

If you specify several addresses, the specific one at the time of payment will be selected randomly.



# Calling a payment


## Conversion via [TON Swap](https://tonswap.io/)

The merchant can call the payment window using the following method:

    tonaccept.requestPayment(orderId, description, amount, [currency], [validUntilUtc], [onSuccess], [onFailure]);

By default, all payments are denominated in USDT, unless an alternative currency is specified. If an alternative currency is specified, then if it is available on TON Swap in a pair to WTON, then an attempt will be made to search for rates to the other accepted currencies. If it is not available, the widget will display only it.

Upon successful completion of the payment, the callback specified in onSuccess is called, and the hash of the transaction is passed to it. If the widget window is closed
or the payment is unsuccessful, onFailure is called .



## Multi-currency prices

Alternatively, if the product is denominated in several currencies, you can use the following method:

    let price = new Map();
    price.set('TON', 100);
    price.set('USDC', 40);
    price.set('0:...', 60);

    tonaccept.requestMultiCurPayment(orderId, description, price, baseCurrency, [validUntilUtc], [onSuccess], [onFailure]);

**In the case of specifically specified multi-currency prices, auto-conversion via TON Swap is not carried out!**


# Standalone widget host or How to host widget by myself
You can raise the payment page on your domain, and not use broxus

1. Host the widget code from [the repository](#) on your domain
2. Host the layout code from [the repository](#) on your domain (separately)
3. [Add](#setup-example) to the site ``` <script src="<hosted script url> data-src="<hosted web-app url>"...> ```

