import { Connection, Keypair, VersionedTransaction, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { toByteArray } from 'base64-js';
import { Buffer } from 'buffer';

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
};

class SwapService {
  constructor() {
    this.connection = null;
    this.keypair = null;
  }

  initialize(rpcEndpoint, privateKey) {
    this.connection = new Connection(rpcEndpoint || 'https://api.mainnet-beta.solana.com');
    if (privateKey) {
      this.keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    }
  }

  getTokenMint(symbol) {
    return TOKEN_MINTS[symbol.toUpperCase()] || null;
  }

  async getQuote(inputMint, outputMint, amount, slippageBps = 50) {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
      });

      const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);

      if (!response.ok) {
        throw new Error(`Quote API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting quote:', error);
      throw error;
    }
  }

  async getSwapTransaction(quoteResponse, userPublicKey, wrapAndUnwrapSol = true, prioritizationFeeLamports = 10000) {
    try {
      const response = await fetch(JUPITER_SWAP_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey,
          wrapAndUnwrapSol,
          prioritizationFeeLamports,
        }),
      });

      if (!response.ok) {
        throw new Error(`Swap API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting swap transaction:', error);
      throw error;
    }
  }

  async executeSwap(swapTransaction) {
    if (!this.connection || !this.keypair) {
      throw new Error('Service not initialized with connection and keypair');
    }

    try {
      //curl--location 'https://swap-v2.solanatracker.io/swap?from=So11111111111111111111111111111111111111112&to=4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R&fromAmount=1&slippage=10&payer=PAYER_ADDRESS'
      const response = await fetch(
        `https://swap-v2.solanatracker.io/swap?from=${inputToken}&to=${outputToken}&fromAmount=${amountInSmallestUnit}&fromAmount=1&slippageBps=10&userPublicKey=${userPublicKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      const quoteData = await response.json();

      /*
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      transaction.sign([this.keypair]);

      const bhInfo = await this.connection.getLatestBlockhashAndContext('finalized');
      transaction.message.recentBlockhash = bhInfo.value.blockhash;

      const simulation = await this.connection.simulateTransaction(transaction, {
        commitment: 'processed'
      });

      if (simulation.value.err) {
        throw new Error('Simulate failed: ' + simulation.value.err);
      }

      const signature = await this.connection.sendTransaction(transaction, {
        skipPreflight: true,
        preflightCommitment: 'processed'
      });

      const confirmation = await this.connection.confirmTransaction(signature, {
        commitment: 'finalized',
        lastValidBlockHeight: bhInfo.value.lastValidBlockHeight
      });

      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + confirmation.value.err);
      }

      return {
        signature,
        explorerUrl: `https://solscan.io/tx/${signature}`,
      };
      */
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  calculateOutputAmount(quoteResponse) {
    if (!quoteResponse || !quoteResponse.outAmount) {
      return '0';
    }
    return quoteResponse.outAmount;
  }

  calculatePriceImpact(quoteResponse) {
    if (!quoteResponse || !quoteResponse.priceImpactPct) {
      return '0';
    }
    return quoteResponse.priceImpactPct;
  }

  getRoutePlan(quoteResponse) {
    if (!quoteResponse || !quoteResponse.routePlan) {
      return [];
    }
    return quoteResponse.routePlan;
  }

  async signAndSendSwapTransaction(swapTransaction, signTransactions) {
    if (!this.connection) {
      this.connection = new Connection('https://api.mainnet-beta.solana.com');
    }

    try {
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');

      const swapTx = VersionedTransaction.deserialize(swapTransactionBuf);
      console.log({ swapTransactionBuf });

      // Use mobile wallet adapter to sign and send
      const signedTransactions = await signTransactions({
        transactions: [swapTx]
      });

      // 4. Send the signed transaction
      const signedTx = signedTransactions[0]; // grab the signed versioned transaction

      console.log({ sig: signedTx })
      // Serialize and send
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());

      console.log({ sent: true })

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'finalized');
      console.log({ confirmed: true })

      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + confirmation.value.err);
      }

      return {
        signature: signature,
        explorerUrl: `https://solscan.io/tx/${signature}`,
      };
    } catch (error) {
      console.error('Error signing and sending swap:', error);
      throw error;
    }
  }
}

export default new SwapService();