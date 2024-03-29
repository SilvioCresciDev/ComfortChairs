App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load items.
    $.getJSON("../items.json", function (data) {
      var itemsRow = $("#itemsRow");
      var itemTemplate = $("#itemTemplate");

      for (i = 0; i < data.length; i++) {
        itemTemplate.find(".panel-title").text(data[i].name);
        itemTemplate.find("img").attr("src", data[i].picture);
        itemTemplate.find(".item-description").text(data[i].description);
        itemTemplate.find(".item-price").attr("price", data[i].price);
        itemTemplate
          .find(".coin")
          .text(data[i].price / 1000000000000000000);
        itemTemplate.find(".btn-pay").attr("data-id", data[i].id);

        itemsRow.append(itemTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  //inizializza la connessione con la blockchain
  initWeb3: async function () {
    // Modern dapp browsers with metamask
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers uses ganache
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    //carica Coin.json da build/contracts
    $.getJSON("Coin.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CArtifact = data;
      App.contracts.Coin = TruffleContract(CArtifact);
      // Set the provider for our contract
      App.contracts.Coin.setProvider(App.web3Provider);
    });
    //fa il binding degli eventi con l'interfaccia grafica
    return App.bindEvents();
  },

  bindEvents: function () {

    $(document).on("click", ".btn-pay", App.makeTransaction);
  },

  transactionSuccess: function (price) {
    alert(
      "Transazione eseguita con successo: " +
        price / 1000000000000000000 +
        "Coin"
    );
  },

  makeTransaction: function (event) {
    event.preventDefault();
    console.log(event);
    var price = parseInt($(event.target).attr("price"));
    var itemId = parseInt($(event.target).data("id"));

    console.log(price);
    console.log(itemId);
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      console.log("qui ci sono gli account", accounts);
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Coin.deployed()
        .then(function (instance) {
          contractInstance = instance;
          
          console.log(contractInstance.balanceOf(account));
          return contractInstance.payItem(price, itemId, { from: account });
          //return contractInstance.transferAt(price, itemId);
        })
        .then(function (result) {
          console.log(result);
          return App.transactionSuccess(price);
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
