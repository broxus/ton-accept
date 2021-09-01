(function () {
    const addIframe = () => {
        const iframe = document.createElement('iframe');

        iframe.src = 'https://wintexpro.github.io/ton-accept/'; // todo

        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.height = '100vh';
        iframe.style.width = '100vw';
        iframe.style.zIndex = '999999';
        iframe.style.border = 'none';

        return document.body.appendChild(iframe);
    };

    let iframe = null;

    const script = document.currentScript;

    addEventListener('message', (e) => {
        if (e.data.command === 'success') {
            iframe.remove();
            (eval(script.dataset.onPaymentSuccess))(e.data.hash);
        }
        if (e.data.command === 'failure') {
            iframe.remove();
            (eval(script.dataset.onPaymentFailure))();
        }
    });

    window.tonaccept = {
        setCurrencies(currencies) {
            window.tonaccept.config.currencies = currencies;
        },
        config: {
            currencies: null,
            currenciesRemote: null,

            storeIcon: null,
            storeAddress: null,
            storeName: null,
        },
        addresses: [],
        requestPayment(orderId, description, amount, currency = 'USDT', validUntilUtc = null,
            onSuccess = () => undefined, onFailure = () => undefined,) {
            script.dataset.onPaymentSuccess = onSuccess;
            script.dataset.onPaymentFailure = onFailure;
            iframe = addIframe()
            iframe.onload = () => {
                iframe.contentWindow.postMessage({
                    command: 'setRequestPayment',
                    request: {
                        orderId,
                        description,
                        amount,
                        currency,
                        validUntilUtc,
                    },
                    config: window.tonaccept.config,
                    addresses: window.tonaccept.addresses,
                }, '*');
            };
        },
        requestMultiCurPayment(orderId, description, price, baseCur = "USDT", validUntilUtc = null,
            onSuccess = () => undefined, onFailure = () => undefined,) {
            script.dataset.onPaymentSuccess = onSuccess;
            script.dataset.onPaymentFailure = onFailure;
            iframe = addIframe()
            iframe.onload = () => {
                iframe.contentWindow.postMessage({
                    command: 'setRequestMultiCurPayment',
                    request: {
                        orderId,
                        description,
                        price,
                        baseCur,
                        validUntilUtc,
                    },
                    config: window.tonaccept.config,
                    addresses: window.tonaccept.addresses,
                }, '*');
            };
        },
    };

})()