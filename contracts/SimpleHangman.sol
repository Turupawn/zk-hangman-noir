// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

// Interfaz de contrato verificador ZK
interface IVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

// Contrato demostración de equemas de commit-reveal
contract SimpleHangman {
    // El commitment de la palablra por adivinar, este se calcula con keccak256(word)
    bytes32 public wordHash;
    // La cantidad de letras en la palabra secreta
    uint public wordLength;
    // El address de quien adivinó la palablra
    address public winner;
    // Contrato verificador de las pruebas ZK
    IVerifier verifier;

    constructor(address verifierAddress) {
        verifier = IVerifier(verifierAddress);
    }

    // Al iniciar el juego, almacenamos un commitment a la palabra con la que jugaremos
    function init(bytes calldata _proof, bytes32[] calldata _publicInputs) public {
        require(verifier.verify( _proof, _publicInputs), "Invalid proof");
        wordLength = uint(_publicInputs[0]);
        wordHash = _publicInputs[2];
    }

    // Intenta adivinar la palabra oculta
    function playWord(bytes calldata _proof, bytes32[] calldata _publicInputs) public {
        require(wordLength > 0, "Game hasn't been initialized");
        require(verifier.verify( _proof, _publicInputs), "Invalid proof");
        require(winner == address(0), "Game already played");
        bytes32 _wordHash = _publicInputs[2];
        require(_wordHash == wordHash, "Invalid word");
        winner = address(uint160(uint256(_publicInputs[1])));
    }

    // Nos ayuda hashear la palabra, puedes usarla para calcular el commitment antes de lanzar el contrato
    function hashFunction(string memory value) public pure returns(bytes32)
    {
        return keccak256(abi.encodePacked(value));
    }
}