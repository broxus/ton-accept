# Ton Accept

Ton Accept is a payment widget that allows you to processing TON payments by using [TON Crystal Extension](https://l1.broxus.com/freeton/wallet).
It can be installed on any site by including widget code on your web pages. So when installed, web page can trigger a pop-up payment window.


# Contents

- [Ton accept](#ton-accept)
- [Contents](#contents)
- [Getting started](#getting-started)
- [Entire setup example](#setup-example)
- [Supported currencies](#supported-currencies)
- [Configuration](#сonfiguration)
    - [Available currencies](#available-currencies)
    - [Store metadata](#store-metadata)
    - [Payment address](#payment-address)
- [Payment Action](#сalling-a-payment)
    - [Conversion via TON Swap](#conversion-via-ton-swap)
    - [Multi-currency payment](#multi-currency-payment)
- [Self-Hosted widget](#self-hosted-widget)


# Getting started

<!-- - Install TON Crystal [browser extension](https://chrome.google.com/webstore/detail/ton-crystal-wallet/cgeeodpfagjceefieflmdfphplkenlfk) -->
- Set the widget code on your site. Use offitial repository, or you can host widget components [by yourself](#self-hosted-widget). Source code includes 2 components: with the widget code (src) and the layout code (data-src):
    \<script src="https://github.com/broxus/..."  data-src="https://github.com/broxus/..." \/\>
- [Сonfigure](#configuration) widget and setup a [payment callbacks](#calling-a-payment)
- Use a trigger you want for calling widget payment function.
- That is all. You can accept payments.

# Setup example


```html
<body>
    <script src="https://..." data-src="https://..."></script>
    <script>
        function payment() {
            // Set currencies by name or root contract address (TIP3)
                window.tonaccept.config.currencies = ['TON', '0:...'];
                // or
                // window.tonaccept.config.currenciesRemote = 'https://...';

            // Add a payment address
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
                    // Payment callbacks will be called after payment
                    const onSuccess = () => console.log('onSuccess');
                    const onFailure = () => console.log('onFailure');
                    window.tonaccept.requestPayment(
                        orderId, description, amount, currency, validUntilUtc, onSuccess, onFailure);

                // or may be you want to use multicurrency
                    /*
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
                    */
        }

            // Optional store settings
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

Widget can operate with currencies supported by TON Crystal browser extension 
- *TON Crystal*
- *TIP-3/Broxus*

You can setup list of currencies you needs.


# Configuration

## Available currencies
The widget stores an array with the available currencies in the config.currencies parameter. In this case, you can specify either as symbolic names of currencies (from [the official list of currencies](https://github.com/broxus/ton-assets/blob/master/manifest.json)), or by specifying the address of the root contract of the token.

You can setup available currencies in three ways:
Through direct assignment

```javascript
tonaccept.config.currencies = ['TON', 'USDC', '0:...'];
```

or by calling the *setCurrencies* method

```javascript
tonaccept.config.setCurrencies(['TON', 'USDC', '0:...']);
```
or by specifying a REST method that will return a sorted list in the form of a simple sorted JSON array

```javascript
tonaccept.config.currenciesRemote = 'https://localhost/currencies';
```


## Store metadata

The merchant can set icon, url and name for store:

```javascript
tonaccept.config.storeIcon = 'https://localhost/icon';

tonaccept.config.storeAddress = 'https://localhost/';

tonaccept.config.storeName = 'Megastore';
```

This data will be displayed on the widget pop-up.


## Payment address

The merchant can specify one or more addresses for accepting payments:

```javascript
tonaccept.addresses.push('0:...');
```
If you specify several addresses, the specific one will be selected randomly for each payment.



# Calling a payment

## Conversion via [TON Swap](https://tonswap.io/)

The merchant can call the payment window using the following method:

```javascript
tonaccept.requestPayment(
    orderId, description, amount, [currency], [validUntilUtc], [onSuccess], [onFailure]);
```

By default, all payments are denominated in USDT, unless an alternative currency is specified. If an alternative currency is specified and available on TON Swap in a pair to WTON, widget will search for rates to the other accepted currencies. Otherwise, when currency isn't available on TON Swap, the widget will display it without any rates.

When payment completed successfully, widget calls specified onSuccess callback with transaction hash in the only one parameter, otherwise widget calls onFailure callback

## Multi-currency payment

If the product is denominated in several currencies, you can use the following method:


```javascript
let price = new Map();
price.set('TON', 100);
price.set('USDC', 40);
price.set('0:...', 60);

tonaccept.requestMultiCurPayment(
    orderId, description, price, baseCurrency, [validUntilUtc], [onSuccess], [onFailure]);
```

**TON Swap conversion won't work for multi-currency payments!**


# Self-hosted widget
You can host the payment page and a widget code by yourself on your domain (so you won't use it from repo)

1. Host the widget code from [the repository](#) anywhere you want.
2. Host the layout code from [the repository](#) too
3. [Setup](#setup-example) a widget in this way ``` <script src="<hosted script url (1)> data-src="<hosted web-app url (2)>"...> ```
