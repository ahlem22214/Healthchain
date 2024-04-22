// metamask.service.ts

import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {
  private web3: any;

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
    } else {
      console.warn('MetaMask not detected. Please install MetaMask.');
    }
  }

  async connect(): Promise<boolean> {
    if (!this.web3) {
      return false;
    }

    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (error) {
      console.error('User denied account access:', error);
      return false;
    }
  }

  async getSelectedAccount(): Promise<string | null> {
    if (!this.web3) {
      return null;
    }

    try {
      // Ensure MetaMask is connected
      const accounts = await this.web3.eth.getAccounts();
      if (accounts.length > 0) {
        return accounts[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching selected account:', error);
      return null;
    }
  }
}
