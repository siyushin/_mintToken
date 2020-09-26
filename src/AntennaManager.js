import Antenna from 'iotex-antenna'
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws';
import Config from './Config'

const AntennaManager = {
	antenna: null,

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

		console.log(accounts[0].address)
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
		}, supply, name, symbol, decimals).then(contractAddress => {
			this.getReceipt(contractAddress, callback)
		}).catch(err => {
			console.error('部署失败：', err)
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
		}, supply, name).then(contractAddress => {
			this.getReceipt(contractAddress, callback)
		}).catch(err => {
			console.error('部署失败：', err)
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
				console.error('生成NTF失败：', err)
			})
	},

	getReceipt: function (hxid, callback) {
		this.antenna.iotx.getReceiptByAction({
			actionHash: hxid
		}).then(res => {
			callback(res.receiptInfo.receipt.contractAddress)
		}).catch(errTx => {
			console.error('获取交易详情失败：', errTx)
			setTimeout(() => {
				this.getReceipt(hxid, callback)
			}, 3000);
		})
	}
}

export default AntennaManager