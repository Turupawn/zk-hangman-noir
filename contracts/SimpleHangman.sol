// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Contrato demostración de equemas de commit-reveal
contract SimpleHangman {
    // El commitment de la palabra por adivinar, este se calcula con keccak256(word)
    // Aunque esto esconde una palabra, no provee ninguna garantía que es una palabra válida
    bytes32 public wordHash;
    // El address del ganador, quien adivinó la palabra
    address public winner;

    // Al iniciar el juego, almacenamos un commitment a la palabra con la que jugaremos
  constructor (bytes32 _wordHash) payable {
        wordHash = _wordHash;
    }
    // Intenta adivinar la palabra oculta
    // Esto es sujeto a un ataque de frontrunn, el atacante puede ver la palabra en la mempool y pagar mas gas para ganar
    function playWord(string memory word) public {
        require(winner != address(0), "Game already played");
        require(hashFunction(word) == wordHash, "Invalid word");
        winner = msg.sender;
    }

    // Nos ayuda hashear la palabra, puedes usarla para calcular el commitment antes de lanzar el contrato
    function hashFunction(string memory value) public pure returns(bytes32)
    {
        return keccak256(abi.encodePacked(value));
    }
}
