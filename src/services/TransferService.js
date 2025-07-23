/**
 * Transfer Service - Gestion des transferts d'actifs
 * Ce service simule les interactions avec un wallet Solana et la blockchain
 */

import { Alert } from 'react-native';

// Simulation d'une connexion wallet
export class TransferService {
  
  /**
   * Valide une adresse Solana
   */
  static validateSolanaAddress(address) {
    // Validation basique d'une adresse Solana (32-44 caractères alphanumériques)
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
  }

  /**
   * Calcule les frais estimés pour un transfert
   */
  static calculateFees(amount, assetType = 'token') {
    const baseAmount = parseFloat(amount) || 0;
    
    // Frais différents selon le type d'actif
    const feeRates = {
      token: 0.001, // 0.1%
      stock: 0.0025, // 0.25%
      etf: 0.0015, // 0.15%
    };
    
    const feeRate = feeRates[assetType] || feeRates.token;
    const fee = baseAmount * feeRate;
    
    // Frais minimum de 0.01$
    return Math.max(fee, 0.01);
  }

  /**
   * Vérifie si le solde est suffisant pour le transfert
   */
  static checkSufficientBalance(asset, amount, fees) {
    const currentBalance = parseFloat(asset.currentValue.replace('$', '').replace(',', '')) || 0;
    const totalRequired = parseFloat(amount) + parseFloat(fees);
    
    return currentBalance >= totalRequired;
  }

  /**
   * Simule l'ouverture du wallet pour signature
   */
  static async requestWalletSignature(transferData) {
    return new Promise((resolve, reject) => {
      // Simulation d'un délai d'attente utilisateur
      setTimeout(() => {
        // 90% de chance que l'utilisateur approuve
        const userApproved = Math.random() > 0.1;
        
        if (userApproved) {
          resolve({
            signature: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          });
        } else {
          reject(new Error('User rejected the transaction'));
        }
      }, 2000); // 2 secondes pour simuler le temps de réflexion
    });
  }

  /**
   * Construit et envoie la transaction
   */
  static async sendTransaction(transferData, signature) {
    return new Promise((resolve, reject) => {
      // Simulation d'envoi sur la blockchain
      setTimeout(() => {
        // Pour le moment, on simule toujours un succès
        const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        resolve({
          success: true,
          transactionHash,
          blockNumber: Math.floor(Math.random() * 1000000) + 150000000,
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
          timestamp: new Date().toISOString(),
        });
        
        // Code commenté pour la simulation d'échec (à réactiver plus tard si besoin)
        /*
        // 85% de chance de succès
        const isSuccess = Math.random() > 0.15;
        
        if (isSuccess) {
          const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          resolve({
            success: true,
            transactionHash,
            blockNumber: Math.floor(Math.random() * 1000000) + 150000000,
            gasUsed: Math.floor(Math.random() * 50000) + 21000,
            timestamp: new Date().toISOString(),
          });
        } else {
          // Différents types d'erreurs possibles
          const errors = [
            'Insufficient balance',
            'Network congestion',
            'Invalid recipient address',
            'Transaction timeout',
            'Gas price too low',
          ];
          
          const randomError = errors[Math.floor(Math.random() * errors.length)];
          reject(new Error(randomError));
        }
        */
      }, 3000); // 3 secondes pour simuler la confirmation blockchain
    });
  }

  /**
   * Processus complet de transfert
   */
  static async executeTransfer(transferData) {
    try {
      // 1. Validation finale
      if (!this.validateSolanaAddress(transferData.recipientAddress)) {
        throw new Error('Invalid recipient address format');
      }

      const fees = this.calculateFees(transferData.amount, transferData.asset.type);
      
      if (!this.checkSufficientBalance(transferData.asset, transferData.amount, fees)) {
        throw new Error('Insufficient balance for this transfer');
      }

      // 2. Demande de signature wallet
      const signatureResult = await this.requestWalletSignature(transferData);

      // 3. Envoi de la transaction
      const transactionResult = await this.sendTransaction(transferData, signatureResult.signature);

      // 4. Mise à jour du stockage local (simulation)
      await this.updateLocalStorage(transferData, transactionResult);

      return {
        success: true,
        ...transactionResult,
        fees: fees.toFixed(2),
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Sauvegarde la transaction dans le stockage local
   */
  static async updateLocalStorage(transferData, transactionResult) {
    // Dans une vraie app, on sauvegarderait dans AsyncStorage ou Redux
    console.log('Saving transaction to local storage:', {
      ...transferData,
      ...transactionResult,
    });
    
    // Simulation d'une sauvegarde
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  /**
   * Récupère l'historique des transferts
   */
  static async getTransferHistory(userId) {
    // Dans une vraie app, on récupérerait depuis l'API ou AsyncStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        // Retourne les données mockées pour la démo
        resolve([
          // Les données mockées sont déjà dans TransferHistoryScreen
        ]);
      }, 1000);
    });
  }

  /**
   * Vérifie le statut d'une transaction
   */
  static async checkTransactionStatus(transactionHash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation du statut de transaction
        const statuses = ['pending', 'completed', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        resolve({
          status: randomStatus,
          confirmations: randomStatus === 'completed' ? Math.floor(Math.random() * 20) + 1 : 0,
          blockNumber: randomStatus !== 'pending' ? Math.floor(Math.random() * 1000000) + 150000000 : null,
        });
      }, 1500);
    });
  }

  /**
   * Génère une URL pour l'explorateur de blockchain
   */
  static getExplorerUrl(transactionHash, network = 'mainnet') {
    const baseUrls = {
      mainnet: 'https://explorer.solana.com',
      devnet: 'https://explorer.solana.com/?cluster=devnet',
      testnet: 'https://explorer.solana.com/?cluster=testnet',
    };
    
    return `${baseUrls[network]}/tx/${transactionHash}`;
  }

  /**
   * Formate une adresse pour l'affichage
   */
  static formatAddress(address, startChars = 6, endChars = 4) {
    if (!address || address.length <= startChars + endChars) {
      return address;
    }
    
    return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
  }

  /**
   * Valide un montant de transfert
   */
  static validateAmount(amount, maxAmount) {
    const numAmount = parseFloat(amount);
    const numMaxAmount = parseFloat(maxAmount.replace('$', '').replace(',', ''));
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }
    
    if (numAmount > numMaxAmount) {
      return { valid: false, error: 'Amount exceeds available balance' };
    }
    
    if (numAmount < 0.01) {
      return { valid: false, error: 'Minimum transfer amount is $0.01' };
    }
    
    return { valid: true };
  }
}

export default TransferService;
