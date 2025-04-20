import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from './circuit/target/zk_hangman.json';

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

// Initialize Noir
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

export const show = (id, content) => {
  const container = document.getElementById(id);
  container.appendChild(document.createTextNode(content));
  container.appendChild(document.createElement("br"));
};

export async function generateProof(word, winnerAddress) {
  // Initialize noir with precompiled circuit
  const noir = new Noir(circuit);
  const backend = new UltraHonkBackend(circuit.bytecode);
  
  // Convert word to array
  const wordArray = Array.from(word)
    .map(char => char.charCodeAt(0).toString())
    .concat(Array(10 - word.length).fill("0"));
  
  show("logs", "Generating witness... ⏳");
  const { witness } = await noir.execute({ 
    word: wordArray,
    word_length: word.length,
    winner: winnerAddress
  });
  show("logs", "Generated witness... ✅");
  
  show("logs", "Generating proof... ⏳");
  const proof = await backend.generateProof(witness, { keccak: true });
  show("logs", "Generated proof... ✅");

  show('logs', 'Verifying proof... ⌛');
  const isValid = await backend.verifyProof(proof, { keccak: true });
  show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
  
  const proofBytes = '0x' + Array.from(Object.values(proof.proof))
    .map(n => n.toString(16).padStart(2, '0'))
    .join('');
  
  return {
    proofBytes,
    publicInputs: proof.publicInputs,
    rawProof: proof.proof
  };
} 
