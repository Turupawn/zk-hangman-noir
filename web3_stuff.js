const NETWORK_ID = 17000 // Holesky
const CONTRACT_ADDRESS = "0xfb89Fb2a693e71B237cE2E6A4CC2EEbFb59034c9"

// Define ABI directly instead of loading from file
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_proof",
        "type": "bytes"
      },
      {
        "internalType": "bytes32[]",
        "name": "_publicInputs",
        "type": "bytes32[]"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_proof",
        "type": "bytes"
      },
      {
        "internalType": "bytes32[]",
        "name": "_publicInputs",
        "type": "bytes32[]"
      }
    ],
    "name": "playWord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3;
let accounts;
let contract;
let isAdmin = false;

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}

const getWeb3 = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }
  return new Web3(window.ethereum);
};

const getContract = async (web3) => {
  return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
};

async function loadDapp() {
  try {
    metamaskReloadCallback();
    web3 = await getWeb3();
    
    const netId = await web3.eth.net.getId();
    if (netId !== NETWORK_ID) {
      document.getElementById("web3_message").textContent = "Please connect to Holesky network";
      return;
    }

    contract = await getContract(web3);
    
    accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      onWalletConnected();
    } else {
      document.getElementById("web3_message").textContent = "Please connect wallet";
      document.getElementById("connect_button").style.display = "block";
      document.getElementById("connected_section").style.display = "none";
    }
  } catch (error) {
    console.error("Error loading dapp:", error);
    document.getElementById("web3_message").textContent = error.message;
  }
}

async function connectWallet() {
  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    onWalletConnected();
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}

function onWalletConnected() {
  document.getElementById("connect_button").style.display = "none";
  document.getElementById("web3_message").textContent = "Connected!";
  document.getElementById("wallet_address").textContent = `Wallet: ${accounts[0]}`;
  document.getElementById("connected_section").style.display = "block";
  document.getElementById("forms").style.display = "block";
}

// Contract interaction functions
async function submitAdminProof(proofBytes, publicInputs) {
  console.log(proofBytes);
  console.log(publicInputs);
  try {
    await contract.methods.init(proofBytes, publicInputs)
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        document.getElementById("web3_message").textContent = "Transaction pending...";
      })
      .on('receipt', (receipt) => {
        document.getElementById("web3_message").textContent = "Success!";
      });
  } catch (error) {
    console.error("Error submitting admin proof:", error);
    document.getElementById("web3_message").textContent = "Transaction failed";
  }
}

async function submitPlayerProof(proofBytes, publicInputs) {
  try {
    await contract.methods.playWord(proofBytes, publicInputs)
      .send({ from: accounts[0] })
      .on('transactionHash', (hash) => {
        document.getElementById("web3_message").textContent = "Transaction pending...";
      })
      .on('receipt', (receipt) => {
        document.getElementById("web3_message").textContent = "Success!";
      });
  } catch (error) {
    console.error("Error submitting player proof:", error);
    document.getElementById("web3_message").textContent = "Transaction failed";
  }
}

export { loadDapp, connectWallet, submitAdminProof, submitPlayerProof }; 