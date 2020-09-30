import Antenna from 'iotex-antenna'
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws';
import Config from './Config'

const AntennaManager = {
	antenna: null,
	countRetry: 0,
	limitRetry: 20,

	init: function () {
		this.antenna = new Antenna(Config.rpcURL, {
			signer: new WsSignerPlugin()
		});
	},

	getAccounts: async function () {
		const accounts = await this.antenna.iotx.accounts;
		if (accounts?.length === 0) {
			setTimeout(() => {
				this.getAccounts()
			}, 10000);
			return;
		}

		return accounts[0]
	},

	deployContract: function (name, symbol, decimals, supply, callback) {
		this.antenna.iotx.deployContract({
			from: this.getAccounts().address,
			amount: "0",
			abi: Config.abi,
			data: null,
			gasLimit: "1000000",
			gasPrice: "1000000000000",
		}, supply, name, symbol, decimals).then(hxid => {
			if (hxid) {
				this.getReceipt(hxid, callback)
			} else {
				window.alert('No transaction ID.')
				callback('ERROR')
			}
		}).catch(err => {
			console.error(err)
		})
	},

	deployERC721Contract: function (name, supply, callback) {
		this.antenna.iotx.deployContract({
			from: this.getAccounts().address,
			amount: "0",
			abi: Config.abi721,
			data: null,
			gasLimit: "1000000",
			gasPrice: "1000000000000",
		}, supply, name).then(hxid => {
			if (hxid) {
				this.getReceipt(hxid, callback)
			} else {
				window.alert('No transaction ID.')
				callback('ERROR')
			}
		}).catch(err => {
			console.error(err)
		})
	},

	mint721: function (contractAddress, ipfsPath, callback) {
		this.antenna.iotx.executeContract(
			{
				contractAddress: contractAddress,
				amount: "0",
				abi: Config.abi721,
				method: "awardItem",
				gasLimit: "1000000",
				gasPrice: "1000000000000",
				from: this.antenna.iotx.accounts[0].address
			},
			this.antenna.iotx.accounts[0].address,
			ipfsPath).then(res => {
				callback(res)
			}).catch(err => {
				console.error(err)
			})
	},

	getBalanceOf(contractAddress, callback) {
		this.antenna.iotx.executeContract(
			{
				contractAddress: contractAddress,
				amount: "0",
				abi: Config.abi,
				method: "balanceOf",
				gasLimit: "1000000",
				gasPrice: "1000000000000",
				from: this.antenna.iotx.accounts[0].address
			},
			this.antenna.iotx.accounts[0].address
		).then(res => {
			callback(res)
		})
	},

	get721BalanceOf(contractAddress, callback) {
		this.antenna.iotx.executeContract(
			{
				contractAddress: contractAddress,
				amount: "0",
				abi: Config.abi721,
				method: "balanceOf",
				gasLimit: "1000000",
				gasPrice: "1000000000000",
				from: this.antenna.iotx.accounts[0].address
			},
			this.antenna.iotx.accounts[0].address
		).then(res => {
			callback(res)
		})
	},

	getReceipt: function (hxid, callback) {
		if (this.countRetry >= this.limitRetry) {
			this.countRetry = 0
			window.alert('Cannot get a receipt of the transaction ' + hxid)
			callback('ERROR')
		}

		this.countRetry += 1

		this.antenna.iotx.getReceiptByAction({
			actionHash: hxid
		}).then(res => {
			if (res && res.receiptInfo && res.receiptInfo.receipt && res.receiptInfo.receipt.contractAddress) {
				this.countRetry = 0
				callback(res.receiptInfo.receipt.contractAddress)
			} else {
				console.warn('The receript data is incorrect：', res)

				setTimeout(() => {
					this.getReceipt(hxid, callback)
				}, 3000);
			}
		}).catch(errTx => {
			console.error('The transaction id is maybe incorrect.', errTx)

			setTimeout(() => {
				this.getReceipt(hxid, callback)
			}, 3000);
		})
	}
}

export default AntennaManager