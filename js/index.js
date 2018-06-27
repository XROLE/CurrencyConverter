"use strict";

window.onload = () => {
    
// make a fetch request to populate the fields
// fetch('https://free.currencyconverterapi.com/api/v5/currencies')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     let currency = JSON.stringify(myJson);
    
//   });

let jsonVar = {
    text: "example",
    number: 1
};
 let result = Object.keys(jsonVar);
    console.log(...result);

 // assigning html elements to variables
let conversionButton = document.getElementById('convert');
let amount = document.getElementById('Amount');
let from = document.getElementById('from');
let to = document.getElementById('to');
let displayResult = document.getElementById('displayResult').value='#500';

    amount.focus(); //keeping the cursor in the amount field on each reload
    conversionButton.addEventListener("click", () => alert(displayResult));










 }