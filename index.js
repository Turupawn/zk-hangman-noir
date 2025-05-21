import { connectWallet, loadDapp, submitAdminProof, submitPlayerProof } from './web3_stuff.js';
import { generateProof, show } from './zk_stuff.js';

// Initialize dapp
loadDapp();

document.getElementById("connect_button").addEventListener("click", async () => {
  connectWallet();
});

document.getElementById("admin_submit").addEventListener("click", async () => {
  const word = document.getElementById("admin_word").value;
  const { proofBytes, publicInputs, rawProof } = await generateProof(
    word, 
    "0x0000000000000000000000000000000000000000"
  );
  
  await submitAdminProof(proofBytes, publicInputs);
  show("results", rawProof);
});

document.getElementById("player_submit").addEventListener("click", async () => {
  const word = document.getElementById("player_word").value;
  const winnerAddress = document.getElementById("winner-address").value;
  const { proofBytes, publicInputs, rawProof } = await generateProof(
    word,
    winnerAddress
  );
  
  await submitPlayerProof(proofBytes, publicInputs);
  show("results", rawProof);
});