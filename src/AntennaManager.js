import BigNumber from 'bignumber.js'
import Antenna from 'iotex-antenna'
import { validateAddress } from 'iotex-antenna/lib/account/utils'
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws'
import AbiConfig from './AbiConfig'
import Config from './Config'
import { JsBridgeSignerMobile } from './js-plugin'
import Utilities from './Utilities'

const AntennaManager = {
	antenna: null,
	countRetry: 0,
	limitRetry: 5,
	jsSigner: null,

	init: function () {
		BigNumber.config({ DECIMAL_PLACES: 12 })
		this.jsSigner = Utilities.isIoPayMobile() ? new JsBridgeSignerMobile() : new WsSignerPlugin()
		this.antenna = new Antenna(Config.rpcURL, {
			signer: this.jsSigner
		});
	},

	getAccounts: async function () {
		let accounts = ''
		if (Utilities.isIoPayMobile()) {
			accounts = await this.jsSigner.getIoAddressFromIoPay();
			this.antenna.iotx.accounts[0] = await this.jsSigner.getAccount(accounts);
		} else {
			accounts = await this.antenna.iotx.accounts;
		}

		if (accounts?.length === 0) {
			setTimeout(() => {
				this.getAccounts()
			}, 10000);
			return;
		}

		return accounts[0]
	},

	isValidateAddress: function (address) {
		return validateAddress(address)
	},

	deployContract: function (name, symbol, decimals, supply, callback) {
		this.antenna.iotx.deployContract(
			{
				from: this.antenna.iotx.accounts[0].address,
				amount: "0",
				abi: AbiConfig.abi,
				data: Buffer(AbiConfig.bytecode, 'hex'),
				gasLimit: "4000000",
				gasPrice: "1000000000000",
			},
			new BigNumber(supply).multipliedBy(Math.pow(10, decimals)).toString(),
			name,
			symbol,
			decimals
		).then(hxid => {
			return callback(hxid)
		}).catch(err => {
			alert(JSON.stringify(err))
			console.error(err)
		})
	},

	deployERC721Contract: function (name, supply, callback) {
		this.antenna.iotx.deployContract({
			from: this.antenna.iotx.accounts[0].address,
			amount: "0",
			abi: AbiConfig.abi721,
			data: Buffer(AbiConfig.bytecode721, 'hex'),
			gasLimit: "4000000",
			gasPrice: "1000000000000",
		}, supply, name).then(hxid => {
			return callback(hxid)
		}).catch(err => {
			alert(JSON.stringify(err))
			console.error(err)
		})
	},

	mint721: function (contractAddress, ipfsPath, toAddress, callback) {
		this.antenna.iotx.executeContract({
			contractAddress: contractAddress,
			amount: "0",
			abi: AbiConfig.abi721,
			method: "awardItem",
			gasLimit: "1000000",
			gasPrice: "1000000000000",
			from: this.antenna.iotx.accounts[0].address
		},
			toAddress ? toAddress : this.antenna.iotx.accounts[0].address,
			ipfsPath).then(res => {
				callback(res)
			}).catch(err => {
				console.error(err)
			})
	},

	getDecimals: function (contractAddress, callback) {
		this.antenna.iotx.executeContract({
			contractAddress: contractAddress,
			amount: "0",
			abi: AbiConfig.abi,
			method: "decimals",
			gasLimit: "1000000",
			gasPrice: "1000000000000",
			from: this.antenna.iotx.accounts[0].address
		}).then(res => {
			callback(parseInt(res))
		})
	},

	getBalanceOf: function (contractAddress, callback) {
		this.antenna.iotx.executeContract(
			{
				contractAddress: contractAddress,
				amount: "0",
				abi: AbiConfig.abi,
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

	transfer: function (contractAddress, toAddress, amount, callback) {
		this.antenna.iotx.executeContract({
			contractAddress: contractAddress,
			amount: "0",
			abi: AbiConfig.abi,
			method: "transfer",
			gasLimit: "1000000",
			gasPrice: "1000000000000",
			from: this.antenna.iotx.accounts[0].address
		}, toAddress, amount).then(res => {
			return callback(res)
		})
	},

	transferNFT: function (contractAddress, toAddress, tokenID, callback) {
		this.antenna.iotx.executeContract({
			contractAddress: contractAddress,
			amount: "0",
			abi: AbiConfig.abi721,
			method: "transferFrom",
			gasLimit: "1000000",
			gasPrice: "1000000000000",
			from: this.antenna.iotx.accounts[0].address
		}, this.antenna.iotx.accounts[0].address, toAddress, tokenID).then(res => {
			return callback(res)
		})
	},

	get721BalanceOf: function (contractAddress, callback) {
		this.antenna.iotx.executeContract(
			{
				contractAddress: contractAddress,
				amount: "0",
				abi: AbiConfig.abi721,
				method: "balanceOf",
				gasLimit: "1000000",
				gasPrice: "1000000000000",
				from: this.antenna.iotx.accounts[0].address
			},
			this.antenna.iotx.accounts[0].address
		).then(res => {
			callback(parseInt(res))
		})
	},

	getNFTByIndex: async function (contractAddress, index) {
		return String(await this.antenna.iotx.executeContract({
			contractAddress: contractAddress,
			amount: "0",
			abi: AbiConfig.abi721,
			method: "tokenOfOwnerByIndex",
			gasLimit: "1000000",
			gasPrice: "1000000000000",
			from: this.antenna.iotx.accounts[0].address
		}, this.antenna.iotx.accounts[0].address, index));
	},

	getActions: function (hxid, callback) {
		this.antenna.iotx.getActions({
			byHash: {
				actionHash: hxid,
				checkingPending: true
			}
		}).then(res => {
			return callback(res)
		})
	},

	getReceipt: function (hxid, callback) {
		if (this.countRetry >= this.limitRetry) {
			this.countRetry = 0
			return callback('ERROR')
		}

		this.countRetry += 1

		this.antenna.iotx.getReceiptByAction({
			actionHash: hxid
		}).then(res => {
			if (res && res.receiptInfo && res.receiptInfo.receipt && res.receiptInfo.receipt.contractAddress) {
				this.countRetry = 0
				callback(res.receiptInfo.receipt.contractAddress)
			} else if (res && res.receiptInfo && res.receiptInfo.receipt && res.receiptInfo.receipt.status === 1) {
				this.countRetry = 0
				callback(res.receiptInfo.receipt.status)
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