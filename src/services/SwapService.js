import { Connection, Keypair, VersionedTransaction, Transaction, PublicKey } from '@solana/web3.js';
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

      console.log('Quote request params:', {
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
      });

      const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quote API error response:', errorText);
        throw new Error(`Quote API error: ${response.status} - ${errorText}`);
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

  async checkTokenBalance(walletAddress, tokenMint) {
    if (!this.connection) {
      this.connection = new Connection('https://api.mainnet-beta.solana.com');
    }

    try {
      const wallet = new PublicKey(walletAddress);
      const mint = new PublicKey(tokenMint);

      // Get token accounts for this wallet and mint
      const response = await this.connection.getParsedTokenAccountsByOwner(wallet, {
        mint: mint
      });

      if (response.value.length === 0) {
        return 0; // No token account found
      }

      const tokenAccount = response.value[0];
      const balance = tokenAccount.account.data.parsed.info.tokenAmount.amount;
      const decimals = tokenAccount.account.data.parsed.info.tokenAmount.decimals;

      return {
        balance: balance,
        decimals: decimals,
        uiAmount: tokenAccount.account.data.parsed.info.tokenAmount.uiAmount
      };
    } catch (error) {
      console.error('Error checking token balance:', error);
      return { balance: '0', decimals: 8, uiAmount: 0 };
    }
  }

  async signAndSendSwapTransaction(swapTransaction, signTransactions, maxRetries = 3, retryDelay = 2000) {
    console.log('=== Starting signAndSendSwapTransaction ===');
    
    if (!this.connection) {
      console.log('Creating new connection to Solana RPC');
      this.connection = new Connection('https://api.mainnet-beta.solana.com');
    }

    try {
      console.log('Step 1: Deserializing transaction');
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      console.log('Transaction buffer length:', swapTransactionBuf.length);

      const swapTx = VersionedTransaction.deserialize(swapTransactionBuf);
      console.log('Transaction deserialized successfully', { swapTx });

      console.log('Step 2: Requesting signature from wallet');
      // Use mobile wallet adapter to sign and send
      let signedTransactions;
      try {
        signedTransactions = await signTransactions({
          transactions: [swapTx]
        });
        console.log('Wallet signature received successfully');
      } catch (signError) {
        console.error('ERROR during wallet signing:', signError);
        console.error('Sign error details:', {
          message: signError.message,
          stack: signError.stack,
          name: signError.name
        });
        throw signError;
      }

      // 4. Send the signed transaction
      const signedTx = signedTransactions[0]; // grab the signed versioned transaction
      console.log('Step 3: Got signed transaction', { signedTx })
      
      // Retry logic for transaction broadcast
      let signature;
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Serialize and send
          signature = await this.connection.sendRawTransaction(signedTx.serialize());
          console.log({ sent: true, attempt })
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error;
          console.error(`Transaction broadcast failed (attempt ${attempt}/${maxRetries}):`, error);
          
          // Check if it's a network error
          if (this.isNetworkError(error)) {
            console.log('Network error detected, will retry with exponential backoff');
            if (attempt < maxRetries) {
              const backoffDelay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
              console.log(`Retrying in ${backoffDelay}ms...`);
              await new Promise(resolve => setTimeout(resolve, backoffDelay));
              
              // Try to reconnect to RPC
              try {
                this.connection = new Connection('https://api.mainnet-beta.solana.com');
                console.log('Reconnected to RPC');
              } catch (reconnectError) {
                console.error('Failed to reconnect:', reconnectError);
              }
            }
          } else if (attempt < maxRetries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
      
      if (!signature) {
        const errorMessage = this.isNetworkError(lastError) 
          ? 'Network connection failed. Please check your internet connection and try again.'
          : `Failed to broadcast transaction after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`;
        throw new Error(errorMessage);
      }

      // Wait for confirmation with timeout
      try {
        const confirmationTimeout = 30000; // 30 seconds
        const confirmation = await Promise.race([
          this.connection.confirmTransaction(signature, 'finalized'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction confirmation timeout')), confirmationTimeout)
          )
        ]);
        
        console.log({ confirmed: true })

        if (confirmation.value.err) {
          throw new Error('Transaction failed: ' + confirmation.value.err);
        }
      } catch (confirmError) {
        // If confirmation times out, still return the signature so user can check later
        console.error('Confirmation error:', confirmError);
        if (confirmError.message === 'Transaction confirmation timeout') {
          console.log('Transaction sent but confirmation timed out. Transaction may still succeed.');
          return {
            signature: signature,
            explorerUrl: `https://solscan.io/tx/${signature}`,
            warning: 'Transaction sent but confirmation timed out. Please check the explorer for status.'
          };
        }
        throw confirmError;
      }

      return {
        signature: signature,
        explorerUrl: `https://solscan.io/tx/${signature}`,
      };
    } catch (error) {
      console.error('Error signing and sending swap:', error);
      
      // Provide more user-friendly error messages
      if (this.isNetworkError(error)) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message?.includes('User rejected')) {
        throw new Error('Transaction was cancelled by user.');
      } else if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient balance for transaction.');
      }
      
      throw error;
    }
  }

  isNetworkError(error) {
    const networkErrorPatterns = [
      'network request failed',
      'failed to fetch',
      'network error',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'fetch failed',
      'ERR_NETWORK',
      'ERR_INTERNET_DISCONNECTED'
    ];
    
    const errorMessage = error?.message?.toLowerCase() || '';
    return networkErrorPatterns.some(pattern => errorMessage.includes(pattern.toLowerCase()));
  }
}

export default new SwapService();