function htmlToElement(html) {var template = document.createElement('template');template.innerHTML = html.trim();return template.content.firstChild;}
function drawRow(record, i){
	let start = new Date(record.start * 1000).toLocaleString();
	let end = (record.ended ? ``: `<a href="#" onclick="endStake(${i})" class="w-button">End</a>`);

	let html = `<div class="table-row-5-col data-row" data-index="${i}"><div class="table-col data left"><div class="table-1---header---text data center">${start}</div></div><div class="table-col"><div class="table-1---header---text data center">${record.amount}</div></div><div class="table-col"><div class="table-1---header---text data center">${record.gain}</div></div><div class="table-col"><div class="table-1---header---text data center">${(record.ended ? 'Withdrawn':'Ongoing')}</div></div><div class="table-col">${end}</div></div>`;
  let c =document.querySelector(`.data-row[data-index="${i}"]`); 
  if(c!== null){c.replaceWith(htmlToElement(html));}else {document.getElementById("records-table").innerHTML += html;}
}
function setAllowance(amount){
console.log('set');
}
document.getElementById("allowance-form").addEventListener("submit", function(e){
e.preventDefault();
setAllowance(document.getElementById("allowance-input").value);
});

document.getElementById("stake-form").addEventListener("submit", function(e){
e.preventDefault();
startStake(document.getElementById("stake-input").value);
});
let numberOfStakes = 0;
let contractAddress;
let contract;
let ragingBullContract;
let ethAccount;
let globalRecords;
let abi = [{"inputs":[{"internalType":"contract ERC20","name":"_erc20","type":"address"},{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint16","name":"_rate","type":"uint16"},{"internalType":"uint256","name":"_maturity","type":"uint256"},{"internalType":"uint8","name":"_penalization","type":"uint8"},{"internalType":"uint256","name":"_lower","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"penalty","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interest","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"StakeEnd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"StakeStart","type":"event"},{"inputs":[],"name":"asset","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"end","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_rec_number","type":"uint256"}],"name":"get_gains","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"interest_rate","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"ledger","outputs":[{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"gain","type":"uint256"},{"internalType":"uint256","name":"penalization","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"},{"internalType":"bool","name":"ended","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"ledger_length","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lower_amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maturity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penalization","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lower","type":"uint256"},{"internalType":"uint256","name":"_maturity","type":"uint256"},{"internalType":"uint16","name":"_rate","type":"uint16"},{"internalType":"uint8","name":"_penalization","type":"uint8"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"start","outputs":[],"stateMutability":"nonpayable","type":"function"}];
let ragingBullAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"path","type":"address[]"}],"name":"SwapETHForTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"path","type":"address[]"}],"name":"SwapTokensForETH","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_airDropFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_buyLiquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_buyMarketingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_buyTeamFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_liquidityShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_marketingShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellLiquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellMarketingFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_sellTeamFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_teamShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalDistributionShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalTaxIfBuying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalTaxIfSelling","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_walletMax","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newRouterAddress","type":"address"}],"name":"changeRouterVersion","outputs":[{"internalType":"address","name":"newPairAddress","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"checkWalletLimit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deadAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newValue","type":"bool"}],"name":"enableDisableWalletLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isMarketPair","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isSwap","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isTxLimitExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWalletLimitExempt","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lucky","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketingWalletAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumTokensBeforeSwapAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newAirDropFee","type":"uint256"}],"name":"setAirDropFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityTax","type":"uint256"},{"internalType":"uint256","name":"newMarketingTax","type":"uint256"},{"internalType":"uint256","name":"newTeamTax","type":"uint256"}],"name":"setBuyTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityShare","type":"uint256"},{"internalType":"uint256","name":"newMarketingShare","type":"uint256"},{"internalType":"uint256","name":"newTeamShare","type":"uint256"}],"name":"setDistributionSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setIsExcludedFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsTxLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setIsWalletLimitExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setMarketPairStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setMarketingWalletAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"setNumTokensBeforeSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLiquidityTax","type":"uint256"},{"internalType":"uint256","name":"newMarketingTax","type":"uint256"},{"internalType":"uint256","name":"newTeamTax","type":"uint256"}],"name":"setSellTaxes","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newValue","type":"bool"}],"name":"setSwapAndLiquifyByLimitOnly","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"setTeamWalletAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"setWalletLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"luckyblock","type":"uint256"}],"name":"setlucky","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"ad","type":"address"},{"internalType":"bool","name":"NewValue","type":"bool"}],"name":"setwhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startblo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapAndLiquifyByLimitOnly","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamWalletAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapPair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"waiveOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
async function startStake(amount){
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    await contract.methods.start(amount).send({
      gas: 1500000
    }).on('transactionHash', function (hash) {
    }).on('receipt', function (receipt) {
			numberOfStakes = (parseInt(numberOfStakes)+1).toString();

      if(receipt.status == true) {
        let r = {
          start: Date.now()/1000,
          ended: false,
          amount: amount,
          gain: 0
        };
        globalRecords.push(r);
	      drawRow(r, parseInt(numberOfStakes)-1);
        alert('Added new stake');
      }
    })
      .on('confirmation', function (confirmationNumber, receipt) {})
      .on('error', function (error, receipt){console.log(error);});
}

async function endStake(index){
let r = globalRecords[index];r.ended = true;
await contract.methods.end(index).send({gas: 1500000}).on('transactionHash', function (hash) {
    }).on('receipt', function (receipt) {
      if(receipt.status == true) {
	      alert('Successfully ended stake!');
        drawRow(r, index);
      }
    })
      .on('confirmation', function (confirmationNumber, receipt) {})
      .on('error', function (error, receipt) {
        console.log(error);
      });
}

async function drawRows(records){
  for (let i = 0; i < records.length; i++) {
    drawRow(records[i], i);
  };
}

async function getLedgerData(){
	let records = [];

	const numberOfRecords  = await contract.methods.ledger_length(ethAccount).call();
	numberOfStakes = numberOfRecords;

    for (let i = 0; i < numberOfRecords; i++) {
      const ledgerRecord = await contract.methods.ledger(ethAccount, i).call();
      let newGains = 0;
      if(ledgerRecord.ended) {
        newGains = ledgerRecord.gain;
      } else {
        newGains = await contract.methods.get_gains(ethAccount, i).call();
      }
      records.push({
        start: ledgerRecord.from,
        amount: ledgerRecord.amount,
        gain: newGains,
        ended: ledgerRecord.ended,
        index: i
      });
    }
    return records;
}

async function readAllowance(){
    const allowance  = await ragingBullContract.methods.allowance(ethAccount, contract).call();
    console.log(allowance);
	document.getElementById('current-allowance').innerHTML = 'Current allowance: ' +allowance;
}
async function loadMetamask(){
if (window.ethereum) {
      window.web3 = new Web3(ethereum);

      try {
        await ethereum.enable();

        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
          alert('User doesn\'t have any MetaMask accounts!');
          return;
        }
        
        contractAddress = '0xA243Ac49efd894B869372A8DF39F7770784955dA';

        contract = new web3.eth.Contract(abi, contractAddress, {
          from: accounts[0],
        });
        
        ragingBullContract = new web3.eth.Contract(ragingBullAbi, '0xC6B9752614f29499a0D2f276558cef3f593e6E2B', {
          from: accounts[0],
        });
        await readAllowance();

				ethAccount = accounts[0];
        let r = await getLedgerData();
        globalRecords = r;
        await drawRows(r);

      } catch (error) {
        alert(`User rejected access to MetaMask accounts: ${error}`);
      }
    } else {
      alert('This application needs MetaMask in order to work');
    }
}
 loadMetamask();
