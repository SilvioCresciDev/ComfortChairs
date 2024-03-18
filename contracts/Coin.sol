// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Coin is ERC20, AccessControl {
   bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
   address destinatario;

   //mapping che associa il prezzo ad un item
   mapping(uint => uint) private pricesMapping;

   constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply) ERC20(name, symbol) {
      _mint(msg.sender, initialSupply);
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);

      pricesMapping[0] = 25000000000000000000;
      pricesMapping[1] = 20000000000000000000;
      pricesMapping[2] = 30000000000000000000;
      pricesMapping[3] = 35000000000000000000;
      pricesMapping[4] = 60000000000000000000;
      pricesMapping[5] = 125000000000000000000;
      pricesMapping[6] = 120000000000000000000;
      pricesMapping[7] = 400000000000000000000;

   }

   event Debug(address user, address sender, bytes32 role, bytes32 adminRole, bytes32 senderRole);
   event ChecksoloAdmin(address user);
   event ChecksoloMinters(address user);
//   event BalanceChecked(address account, uint256 balance);

   // Modificatore soloAdmin
modifier soloAdmin() {
      // Emette un evento ChecksoloAdmin che registra il mittente
      emit ChecksoloAdmin(msg.sender);
      // Controlla se il mittente è un amministratore
      require(isAdmin(msg.sender), "Restricted to admins");
      // Procede con l'operazione 
      _;
   }

// Modificatore soloMinters
modifier soloMinters() {
      // Emette un evento ChecksoloMinters che registra il mittente
      emit ChecksoloMinters(msg.sender);
      // Controlla se il mittente è un minter
      require(isMinter(msg.sender), "Caller is not a minter");
      // Procede con l'operazione 
      _;
   }

// Funzione per verificare se un account è un amministratore
function isAdmin(address account) public virtual view returns (bool) {
      // Verifica se l'account ha il ruolo di amministratore predefinito
      return hasRole(DEFAULT_ADMIN_ROLE, account);
   }

// Funzione per verificare se un account è un minter
function isMinter(address account) public virtual view returns (bool) {
      // Verifica se l'account ha il ruolo di minter
      return hasRole(MINTER_ROLE, account);
   }

// Funzione di coniazione
function mint(address to, uint256 amount) public soloMinters {
      // Esegue la coniazione
      _mint(to, amount);
    }

// Funzione per aggiungere un nuovo minter
function addMinterRole(address to) public soloAdmin {
      // Emette un evento di debug per registrare l'operazione
      emit Debug(to, msg.sender, MINTER_ROLE, getRoleAdmin(MINTER_ROLE), DEFAULT_ADMIN_ROLE);
      // Assegna il ruolo di minter all'account
      grantRole(MINTER_ROLE, to);
    }

// Funzione per rimuovere il ruolo di minter da un account
function removeMinterRole (address to) public {
      // Rimuove il ruolo di minter dall'account
      renounceRole(MINTER_ROLE, to);
    }

// Funzione per impostare un destinatario
function setDestinatario (address to) public soloAdmin{
      // Imposta il destinatario
      destinatario=to;
    }

// Funzione per ottenere il saldo dei token di un account specificato
function getBalance(address account) public returns (uint256) {
    uint256 balance = balanceOf(account);
    //emit BalanceChecked(account, balance); // Emetti l'evento BalanceChecked
    return balance;
}

// Funzione per pagare un elemento
function payItem(uint256 price, uint itemId) public returns (uint256){
      // Controlla che il prezzo memorizzato per l'elemento corrisponda a quello specificato
      require(pricesMapping[itemId]==price);
      setDestinatario(0x25315f664E8619afCC4F05c85b64F7D40D75f8e6);
      // Controlla che il pagamento sia stato eseguito con successo all'indirizzo del gestore ComfortChair
      require(transfer(destinatario,price));
      // Restituisce l'ID dell'elemento
      return itemId;
    }

}