import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

class TestTransactionService {
  async createTestTransaction(fromPubkey, toPubkey = null) {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    
    // If no recipient, send to self
    const recipient = toPubkey || fromPubkey;
    
    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    
    // Create a simple transfer transaction
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromPubkey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: recipient,
        lamports: 0.001 * LAMPORTS_PER_SOL, // 0.001 SOL
      })
    );
    
    console.log('Created test transaction:', {
      feePayer: transaction.feePayer?.toString(),
      recentBlockhash: transaction.recentBlockhash,
      instructions: transaction.instructions.length,
    });
    
    return { transaction, blockhash, lastValidBlockHeight };
  }
  
  async sendTestTransaction(signAndSendTransactions, userPublicKey) {
    try {
      console.log('Creating test transaction...');
      const { transaction } = await this.createTestTransaction(userPublicKey);
      
      console.log('Sending test transaction to wallet...');
      const signatures = await signAndSendTransactions({
        transactions: [transaction]
      });
      
      console.log('Test transaction sent successfully:', signatures);
      return { success: true, signature: signatures[0] };
    } catch (error) {
      console.error('Test transaction failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new TestTransactionService();