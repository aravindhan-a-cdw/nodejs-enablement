
const getWalletData = async () => {
    const walletURL = process.env.WALLET_DATA_URL;
    if(walletURL === undefined) {
        throw new Error("Wallet DB URL has not been set");
    }
    const response = await fetch(process.env.WALLET_DATA_URL);
    return response.json();
}

module.exports = {getWalletData}