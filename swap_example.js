const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const axios = require('axios');

// It is recommended that you use your own RPC endpoint.
// This RPC endpoint is only for demonstration purposes so that this example will run.
const connection = new Connection('');

const keypair = Keypair.fromSecretKey(bs58.decode(''));

async function swapSolToUsdc() {
  try {
    // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
    const quoteResponse = await axios.get('https://quote-api.jup.ag/v6/quote', {
      params: {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: 100000000, // 0.1 SOL in lamports
        slippageBps: 50
      }
    });
    console.log({ quoteResponse: quoteResponse.data });

    // Get serialized transactions for the swap
    const swapResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
      quoteResponse: quoteResponse.data,
      userPublicKey: keypair.publicKey.toString(),
      wrapAndUnwrapSol: true,
      prioritizationFeeLamports: 10000
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { swapTransaction } = swapResponse.data;

    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log(transaction);

    // Sign the transaction
    transaction.sign([keypair]);

    // Replace the blockhash
    const bhInfo = (await connection.getLatestBlockhashAndContext('finalized'));
    transaction.message.recentBlockhash = bhInfo.value.blockhash;

    // Simulate
    const simulation = await connection.simulateTransaction(transaction, { commitment: 'processed' });
    if (simulation.value.err) {
      throw new Error('Simulate failed: ' + simulation.value.err);
    }
    const signature = await connection.sendTransaction(transaction, { skipPreflight: true, preflightCommitment: 'processed' });
    const confirmation = await connection.confirmTransaction(signature, { commitment: 'finalized', lastValidBlockHeight: bhInfo.value.lastValidBlockHeight });
    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + confirmation.value.err);
    }
    console.log(`https://solscan.io/tx/${signature}`);
  } catch (error) {
    console.error('Error during swap:', error);
  }
}
