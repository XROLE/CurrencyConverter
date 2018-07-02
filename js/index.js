
"use strict";
 
window.onload = () => { 

   //checking to see if service worker exist in the clients browser
   if('serviceWorker' in navigator){
    try{
      navigator.serviceWorker.register('./sw.js');
      console.log('sw registered successfully');
    }catch(error){
      console.log('sw registration failed')
    }
  }

  // assigning html elements to variables
  let conversionButton = document.getElementById('convert');
  let amount = document.getElementById('Amount');
  let from = document.getElementById('from');
  let to = document.getElementById('to');
  let displayResult = document.getElementById('displayResult');
     
  amount.focus(); //keeping the cursor in the amount field on each reload
 
    
  // making fetch request to the currency api server
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then((response) => {
        return response.json();
    })
    .then(function(myJson) {
      let currencies = myJson.results;     //Object containing currencyName, currencySymbol and id 

      // looping through the currencies object for values
      for(const currency in currencies){
        const money = currencies[currency].currencyName;    //extracting the name of the currency     
        const moneyId = currencies[currency].id;    //extracting the name of the currency     
        const node = document.createElement('option');      //create an <option> element
        const text = `(${moneyId}) ${money}`;
        const textnode = document.createTextNode(text);    // puttin the name of currency in varible
          node.setAttribute('value', moneyId);                //adding value to the option element
          node.appendChild(textnode); 
          from.appendChild(node);            
      }    
      for(const currency in currencies){
        const money = currencies[currency].currencyName;    //extracting the name of the currency     
        const moneyId = currencies[currency].id;    //extracting the name of the currency     
        const node = document.createElement('option');      //create an <option> element
        const text = `(${moneyId}) ${money}`;
        const textnode = document.createTextNode(text);    // puttin the name of currency in varible
          node.setAttribute('value', moneyId);                //adding value to the option element
          node.appendChild(textnode); 
          to.appendChild(node);        
      }    
  });

  //handling currency conversion
  function convertCurrency(amount, fromCurrency1, toCurrency1 ){

    //encoding the query to be pushed
    let fromCurrency = encodeURIComponent(fromCurrency1);
    let toCurrency = encodeURIComponent(toCurrency1);
    let query = `${fromCurrency}_${toCurrency}`;
    // const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    
    // fetch the conversion ratez
    fetch(url)
      .then((response) => {
          return response.json();
      }).then(rated => {
        let val = rated[query];
        if(val){                                            //checking to see if the query was succesfle
          let total = val * amount;                         // computing the total
          let newTotal = Math.round(total * 100) / 100;     // round the converted amount to a whole number
          displayResult.value = newTotal;

          // create indexDB and store rate
          function storeRate(){ 
             let open = indexedDB.open("currencyDB", 1);
            //  let tx = db.transaction("rateStore", "readwrite");
             // Creating the schema
             open.onupgradeneeded = function() {
              let db = open.result;
              let store = db.createObjectStore("rateStore", {keyPath: "id"}); 
              //adding data
              store.put({id:  `${query}`, name: {'rate': `${val}`}});
               // Query the data
                let getRate = store.get(`${query}`);
                getRate.onsuccess = () => console.log(`Rate: ${getRate.result.name.rate}`);
              }  
            // // Close the db when the transaction is done
            //  tx.oncomplete = function() {
            //   db.close();
            // };
          };
          storeRate();
          } else{
          console.log('sommthing bad happened');
        }   
    })    
  }

  
  //attching conversion functionality to button     
  conversionButton.addEventListener("click", (e) => {
    e.preventDefault();
    const convertFrom =from.options[from.selectedIndex].value;
    const convertTo =to.options[to.selectedIndex].value;
    const enteredAmount = amount.value;

    convertCurrency(enteredAmount,convertFrom, convertTo);
           
  });
   
  }

  //working with indexDB

// let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
// let open = indexedDB.open("currencyDB", 1);

// // Creating the schema
// open.onupgradeneeded = function() {
//     let db = open.result;
//     let store = db.createObjectStore("rateStore", {keyPath: "id"});
//     let index = store.createIndex("NameIndex", ["name.last", "name.first"]);
// };

// open.onsuccess = function() {
//     // Start a new transaction
//     let db = open.result;
//     let tx = db.transaction("rateStore", "readwrite");
//     let store = tx.objectStore("rateStore");
//     let index = store.index("NameIndex");

//     // Add some data
//     store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
//     store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
    
//     // Query the data
//     let getJohn = store.get(12345);
//     let getBob = index.get(["Smith", "Bob"]);

//     getJohn.onsuccess = function() {
//         console.log(getJohn.result.name.first);  // => "John"
//     };
//     getBob.onsuccess = function() {
//         console.log(getBob.result.name.first);   // => "Bob"
//     };

//     // Close the db when the transaction is done
//     tx.oncomplete = function() {
//         db.close();
//     };
// }



