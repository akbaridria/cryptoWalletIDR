const APIKEY = 'ckey_4e7ba38c8e50410a92ed0989d8f';

document.getElementById ("getBalance").addEventListener("click", changeCurrency, false);
document.getElementById("currency1").addEventListener("click", changeCurrency, false)
document.getElementById("currency2").addEventListener("click", changeCurrency, false)
document.getElementById("currency3").addEventListener("click", changeCurrency, false)

function getData(asd="USD", cur=1.00) {
  getSpotPrice(asd, cur)
  const address = document.getElementById("address").value
  const wallet = document.getElementById("walletAddress")
  const updateTime = document.getElementById("updateTime")
  const spinner = document.getElementById("spinner")
  spinner.classList.add("show")
  const crypto = document.getElementById("cryptoTable").getElementsByTagName('tbody')[0];
  const totalBalance = document.getElementById("totalBalance");
  const url = new URL(`https://api.covalenthq.com/v1/1/address/${address}/balances_v2`);
      url.search = new URLSearchParams({
          key: APIKEY,
          nft: true
      })
  let total = 0.00;
  const table = document.getElementById("cryptoTable")
  while(table.rows.length >1) {
    table.deleteRow(1);
  }
  let counter = 0;
  const nftTab = document.getElementById("nft");
  nftTab.innerHTML = ""
  fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        spinner.classList.remove("show")
        if( data.error == true) {
          return swal("Error", "Can't find the address or ENS, try another one!", "error");
        }
        
        let tanggal = new Date(data.data.updated_at).toUTCString()
        wallet.innerHTML = `<small> ${data.data.address} </small>`
        updateTime.innerHTML = `<small> ${tanggal} </small>`

        let tokens = data.data.items;
        
        return tokens.map(function(token) {
          counter += 1;
          let totalInRow = ""
          let tempval = 0.00
          if(asd == "USD") {
              tempval = parseFloat(token.quote) * parseFloat(cur)
              totalInRow = "$" + parseFloat(token.quote).toFixed(2)
            } else {
              if(asd == "EUR") {
                tempval = parseFloat(token.quote) * parseFloat(cur)
                totalInRow = "€" + parseFloat(tempval).toFixed(2)
              } else {
                if(asd=="JPY") {
                  tempval = parseFloat(token.quote) * parseFloat(cur)
                  totalInRow = "¥" + parseFloat(tempval).toFixed(2)
                }
                
              }
            }
         
          if(token.type != "nft") {
            
            getTransferData(data.data.address, token.contract_address, asd , cur)
            crypto.insertRow().innerHTML = `<td><img src=${token.logo_url} style=width:30px;height:30px; onerror="this.src='defaultImg.png'"></td>` +
            `<td><small> ${token.contract_name} </small></td>` +
            `<td><small> ${token.contract_address} </small></td>` +
            `<td><small> ${token.contract_ticker_symbol} </small></td>` +
            `<td><small> ${totalInRow} </small></td>`
            total = tempval + total
          } else {
            if(token.type == "nft") {
                if(token.nft_data != null){
                      nftTab.innerHTML += `<div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${counter}" aria-expanded="false" aria-controls="collapseOne">
                      <small> ${token.contract_name} </small>&nbsp;&nbsp;&nbsp;&nbsp; <span class="badge bg-secondary">${token.nft_data.length}</span>
                      </button>
                    </h2>
                    <div id="collapse${counter}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                      <table class="table" id="tokenTable${counter}">
                          <thead>
                              <tr>
                                  <th class="align-middle" style="width: 15%"></th>
                                  <th class="align-middle" style="width: 15%">Token ID</th>
                                  <th class="align-middle" style="width: 15%">Name</th>
                                  <th class="align-middle" style="width: 35%">Description</th>
                                  <th class="align-middle" style="width: 10%"></th>
                              </tr>
                          </thead>
                          <tbody>
                              
                          </tbody>
                      </table> 
                      </div>
                    </div>
                  </div>`;
                  let varDyn = "tokenTable" + counter.toString()
                  
                  const tableRef = document.getElementById(varDyn)
                  token.nft_data.forEach(function(nft) {
                      
                      if(nft.external_data != null) {
                        tableRef.insertRow().innerHTML = 
                        `<td class="align-middle" style="width: 15%"><img src=${nft.external_data.image} style=width:100px;height:100px;></td>` +
                        `<td class="align-middle" style="width: 15%"><small> ${nft.token_id}</small> </td>` +
                        `<td class="align-middle" style="width: 15%"><small> ${nft.external_data.name}</small> </td>` +
                        `<td class="align-middle" style="width: 35%"><small> ${nft.external_data.description}</small> </td>` +
                        `<td class="align-middle" style="width: 10%"><a href=${nft.external_data.external_url} target='_blank'><small>More Details</small></a> </td>`;
                      }               
                  });
                }
                
            }
          }
          if(asd == "USD") {
            totalBalance.innerHTML = '$' + numberWithCommas(parseFloat(total).toFixed(2))
          } else {
            if(asd == "EUR") {
               totalBalance.innerHTML = '€' + numberWithCommas(parseFloat(total).toFixed(2))
            } else {
              totalBalance.innerHTML = '¥' + numberWithCommas(parseFloat(total).toFixed(2))
            }
          }
          
        })
    })
        
        
    
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changeCurrency() {
  let rate_value = "";
  if (document.getElementById('currency1').checked) {
    rate_value = document.getElementById('currency1').value;
  }
  if (document.getElementById('currency2').checked) {
    rate_value = document.getElementById('currency2').value;
  }
  if (document.getElementById('currency3').checked) {
    rate_value = document.getElementById('currency3').value;
  }
  let url = ""
  
  if(rate_value == "USD") {
    return getData("USD", 1.00)
  } else {
    if(rate_value == "EUR") {
      url = "https://free.currconv.com/api/v7/convert?q=USD_EUR&compact=ultra&apiKey=86c439dd4d37b6310747"
    } else {
      url = "https://free.currconv.com/api/v7/convert?q=USD_JPY&compact=ultra&apiKey=86c439dd4d37b6310747"
    }
  }

  fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
     
      let raw = Object.values(data)
      return getData(rate_value, raw[0])
    })
}

function custom_sort(a, b) {
    return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
}

function getTransferData(address, transfer,asd, cur){
  const table2 = document.getElementById("tableTransfer")
  while(table2.rows.length >1) {
    table2.deleteRow(1);
  }
  
  const tableTransfer = document.getElementById("tableTransfer").getElementsByTagName('tbody')[0];
  const url = new URL(`https://api.covalenthq.com/v1/1/address/${address}/transfers_v2`);
            url.search = new URLSearchParams({
                key: APIKEY,
                "contract-address": transfer
            })

  fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
     
      let tokens = data.data.items;
      return tokens.map(function(token) {
        token.transfers.forEach(function(transfer) {
            let dateBlock = new Date(transfer.block_signed_at).toUTCString()
            amount = parseInt(transfer.delta) / Math.pow(10, transfer.contract_decimals);
            let tempVal = parseFloat(cur) * parseFloat(transfer.delta_quote)
            let inRow = ""
            if(asd == "USD") {
              inRow = "$" + parseFloat(tempVal).toFixed(2)
            }
            if(asd == "EUR") {
              inRow = "€" + parseFloat(tempVal).toFixed(2)
            }
            if(asd == "JPY") {
              inRow = "¥" + parseFloat(tempVal).toFixed(2)
            }
            tableTransfer.insertRow().innerHTML =
                `<td><small> ${dateBlock} </small></td>` +
                `<td><small> ${transfer.from_address_label} </small></td>` +
                `<td><small> ${transfer.contract_ticker_symbol} </small></td>` +
                `<td><small> ${transfer.transfer_type} </small></td>` +
                `<td><small> ${transfer.to_address} </small></td>` +
                `<td><small> ${transfer.to_address_label} </small></td>` +
                `<td><small> ${amount.toFixed(4)} </small></td>` +
                `<td><small> ${inRow} </small></td>`;
        })
      
      })
    })
}



function getSpotPrice(asd, cur) {
  const tableRef = document.getElementById("getPrice").getElementsByTagName('tbody')[0];
  const url = new URL(`https://api.covalenthq.com/v1/pricing/tickers/`);
  url.search = new URLSearchParams({
      key: APIKEY
  })
  const table3 = document.getElementById("getPrice")
  while(table3.rows.length >1) {
    table3.deleteRow(1);
  }
  fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {
      let tokens = data.data.items;
      return tokens.map(function(token) {
        let tempVal = parseFloat(cur) * parseFloat(token.quote_rate)
        let inRow = ""
        if(asd == "USD") {
          inRow = "$" + parseFloat(tempVal).toFixed(2)
        }
        if(asd == "EUR") {
          inRow = "€" + parseFloat(tempVal).toFixed(2)
        }
        if(asd == "JPY") {
          inRow = "¥" + parseFloat(tempVal).toFixed(2)
        }
      tableRef.insertRow().innerHTML = 
          `<td><small><img src=${token.logo_url} style=width:30px;height:30px;></small></td>` +
          `<td><small> ${token.contract_name} </small></td>` +
          `<td><small> ${token.contract_ticker_symbol} </small></td>` +
          `<td><small> ${token.rank} </small></td>` +
          `<td><small> ${inRow} </small></td>`
      })
  })
}

