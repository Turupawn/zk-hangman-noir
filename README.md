# ZK Hangman dApp

A complete zkDapp version of the classic Hangman game built with [Noir](https://noir-lang.org/), Solidity, and a JavaScript frontend.

This project demonstrates how to use Zero Knowledge proofs to:

1. **Prevent frontrunning**: by binding the winner’s address as a public input in the ZK proof.
2. **Enforce valid inputs**: by verifying that the secret word contains only alphabetic characters.
3. **Keep the secret word hidden**: on-chain only the proof and commitments are stored, never the plaintext.

We build and connect three main components:

1. A **Noir circuit** that validates and hashes the secret word.
2. A **Solidity verifier contract** that checks ZK proofs on-chain.
3. A **Web3 frontend** to generate proofs and interact with the contracts.

---

## Architecture

```mermaid
flowchart LR
  A[User's Browser] -->|Generate ZK Proof| B[Noir Circuit + UltraHonk Backend]
  B -->|Submit Proof| C[Verifier Contract]
  C -->|on-chain validation| D[SimpleHangman.sol]
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Bun](https://bun.sh/) (for package management and dev server)
- Browser wallet, I recommend [Rabby](https://rabby.io/) browser extension, Metamask has not been working well for me lately
- Holesky testnet (Network ID: `17000`) but you can use any EVM chain
- `noirup` (for Noir toolchain)

---

## Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/zk-hangman.git
   cd zk-hangman
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile Noir circuit & generate verifier**
   ```bash
   # Compile the circuit
   cd circuit
   nargo compile

   # Generate verification key & Solidity verifier
   bb write_vk -b target/zk_hangman.json -o target --oracle_hash keccak
   bb write_solidity_verifier -k target/vk -o circuits/Verifier.sol
   ```

4. **Deploy contracts**
   - Deploy the `HonkVerifier` contract from `circuits/Verifier.sol` first. You will need to set optimization runs to `200`.
   - Deploy `SimpleHangman` contract from `contracts/SimpleHangman.sol`, passing the verifier address to the constructor.

5. **Configure frontend**
   - Update `web3_stuff.js` with your deployed `CONTRACT_ADDRESS` and `CHAIN_ID` to the chain you deployed the contract. This demo defaults to Holesky `17000` chain.

---

## Usage

Start the development server:

```bash
bunx vite
```

1. Open your browser at `http://localhost:5173`.
2. Connect your wallet to Holesky.
3. As **Admin**: set the secret word (max 10 letters) to initialize the game.
4. As **Player**: guess the word—your address will be bound in the proof to prevent frontrunning.
5. View logs and proof details in the UI.

![Playing th zk hangman](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/31zn4thz6q32kau24837.png)

---

## Project Structure

```bash
.
├── circuits/           # Noir source & Solidity verifier
│   ├── src/main.nr     # Noir circuit
│   └── Verifier.sol    # Generated verifier contract
├── contracts/          # Hangman game contract
│   └── SimpleHangman.sol
├── frontend/           # Web3 and ZK frontend
│   ├── index.html
│   ├── index.js
│   ├── zk_stuff.js
│   └── web3_stuff.js
├── target/             # Noir compilation & VK
└── README.md           # This file
```

---

## Learn More

- Noir Quick Start: https://noir-lang.org/docs/getting_started/quick_start
- Noir + Solidity example by Saleel: https://github.com/saleel/noir-solidity-example/
- My tutorial on spanish: https://dev.to/turupawn/zk-y-noir-el-tutorial-completo-5h51

---

## License

MIT