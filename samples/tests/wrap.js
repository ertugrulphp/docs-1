// This is a snippet useful as reference. It shows:
// - How to sign transactions both from the browser and Node.js
// - How to wrap native tokens by sending them to the WNAT contract.
//
// Someday this might be turned into a proper tutorial.

const FLARE_PACKAGE = "@flarenetwork/flare-periphery-contract-artifacts";
const FLARE_RPC = "https://coston2-api.flare.network/ext/bc/C/rpc";

// Get private keys from an external sources.
// DO NOT embed them in source code!
const TEST_PRIVATE_KEY = "";

async function Wrap_run(amount) {

    // 1. Import dependencies
    var ethers, flare, provider, account, signer;
    if (typeof window === "undefined") {
        // Node.js
        ethers = await import("ethers");
        flare = await import(FLARE_PACKAGE);
        provider = new ethers.JsonRpcProvider(FLARE_RPC);
        signer = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
        account = signer.address;
    } else {
        // Browser
        if (typeof window.tutorialData === "undefined") {
            console.log("Wallet is not connected.\n");
            return;
        }
        ethers = await import("https://esm.run/ethers@6.3");
        flare = await import(`https://esm.run/${FLARE_PACKAGE}`);
        account = window.tutorialData.account;
        provider = new ethers.BrowserProvider(window.tutorialData.provider);
        signer = await provider.getSigner();
    }

    // 2. Access the Contract Registry
    const flareContractRegistry = new ethers.Contract(
        "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
        flare.nameToAbi("FlareContractRegistry", "coston2").data,
        signer);

    // 3. Retrieve the WNat contract
    const wnatAddr = await
        flareContractRegistry.getContractAddressByName("WNat");
    const wnat = new ethers.Contract(
        wnatAddr,
        flare.nameToAbi("WNat", "coston2").data,
        signer);

    balance_nat = await provider.getBalance(account)
    balance_wrapped = await wnat.balanceOf(account);
    console.log(`Balance of account ${account}:`);
    console.log(`  ${Number(balance_nat) / 10 ** 18} C2FLR`);
    console.log(`  ${Number(balance_wrapped) / 10 ** 18} WC2FLR`);
    console.log(`Wrapping ${amount} C2FLR...`);

    const options = { value: ethers.parseEther(amount) };
    await wnat.deposit(options);
    console.log(`Transaction submitted.`);
}

Wrap_run("1");
