Web3MobileWallet.signAndSendTransactions
Privileged method.

This method requests the wallet to sign the specified transactions with the private keys for the authorized addresses, submit the transactions to the network, and return the transaction signatures to the dapp.

  Parameters:
transactions: Transaction[] required

An array of one or more transactions to sign and send.The transaction are of type Transaction or VersionedTransaction from the web3.js library.

  minContextSlot: number

The minimum slot number at which to perform preflight transaction checks.

  Result:
string[] - the corresponding base64 - encoded transaction signatures.
Code sample:
const result = await transact(async (wallet: Web3MobileWallet) => {
  const authResult = await wallet.authorize({
    cluster: 'devnet',
    identity: APP_IDENTITY,
  }));

const publicKey = getPublicKeyFromAuth(authResult)

// Create a web3.js Transaction that transfers
// lamports to a randomly created address.
const keypair = Keypair.generate();
const randomTransferTransaction = new Transaction({
  ...latestBlockhash,
  feePayer: publicKey,
}).add(
  SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: keypair.publicKey,
    lamports: 1_000_000,
  }),
);

// Signs the Transactions with the private key of the account 
// corresponding to `publicKey` and submits to the network.
const transactionSignatures = await wallet.signAndSendTransactions({
  transactions: [randomTransferTransaction],
});
return transactionSignatures;
});


Result:
["<transaction_signature>", ...],