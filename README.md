# PharmXChain Frontend

A React-based frontend application for the blockchain-based Pharmaceutical Supply Chain Management System.

## Overview

This frontend application provides a user-friendly interface to interact with the pharmaceutical supply chain management smart contracts. It allows stakeholders to register entities, manage medicines, track batches, and monitor the movement of drugs through the supply chain with complete transparency and security.

## Features

- **Stakeholder Management**: Register, view, and manage different supply chain entities
- **Medicine Registry**: Create, approve, and track pharmaceutical products
- **Batch Operations**: Create and monitor medicine batches with production and expiry date tracking
- **Transfer Workflows**: Transfer medicine ownership between stakeholders 
- **Dispensing System**: Record medicines dispensed to patients
- **Supply Chain History**: View complete medicine history through the supply chain
- **Authentication**: Secure wallet-based authentication

## Tech Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components
- **Blockchain Interaction**: wagmi, viem
- **Form Management**: react-hook-form with zod validation
- **Notifications**: sonner toast system
- **Routing**: react-router
- **Data Management**: React Query

## Getting Started

### Prerequisites

- Node.js v16 or later
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/UmesiQueen/pharm-x-frontend.git
   cd pharm-x-chain-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Connecting to the Blockchain

The application connects to the Base Sepolia testnet. You'll need:

1. A wallet extension like MetaMask configured for Base Sepolia
2. Test ETH in your wallet (available from Base Sepolia faucets)

## Smart Contract Interaction

The frontend interacts with three main smart contracts:

1. **GlobalRegistry**: Manages entity registration and verification
2. **DrugRegistry**: Handles medicine registration, approval, and batch management
3. **SupplyChainRegistry**: Tracks medicine transfers throughout the supply chain

Contract addresses are configured in `src/lib/constants.ts`.

## Role-Based Access

Different dashboard features are available based on the connected wallet's role:

- **Regulator**: Can approve medicines and entities
- **Manufacturer**: Can register medicines and create batches
- **Supplier**: Can distribute medicines to pharmacies
- **Pharmacy**: Can dispense medicines to patients

---

Built with ❤️ by Queen
