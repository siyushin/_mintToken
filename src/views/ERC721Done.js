import React from 'react';
import Words from 'arwes/lib/Words'
import Button from 'arwes/lib/Button'
import Frame from 'arwes/lib/Frame'
import Line from 'arwes/lib/Line'
import Loading from 'arwes/lib/Loading'
import Link from 'arwes/lib/Link'
import './ERC721Done.css'
import Dropzone from 'react-dropzone';
import ipfs from 'ipfs-http-client'
import AntennaManager from '../AntennaManager';
import Config from '../Config';
import Utilities from '../Utilities';
import debounce from "lodash.debounce"
import Modal from 'react-modal';

const stylesOfModal = {
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		padding: "0.5rem",
		backgroundColor: "black",
		border: "none"
	}
};

class ERC721Done extends React.Component {
	constructor(props) {
		super(props)

		this.theIPFS = null
		this.theJson = null
		this.theAddressInput = null
		this.state = {
			ipfsPath: '',
			balance: 0,
			name: '',
			description: '',
			isChecking: true,
			address: props.deployedAddress,
			toAddress: '',
			toTransfer: '',
			NFTs: [],
			isTransferModalShow: false
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChangeInput = this.onChangeInput.bind(this)
		this.onClickRetry = this.onClickRetry.bind(this)
		this.onChangeInputAddress = this.onChangeInputAddress.bind(this);
		this.onClickTransferLink = this.onClickTransferLink.bind(this)
		this.onClickCloseTransferModal = this.onClickCloseTransferModal.bind(this);
		this.onTransfer = this.onTransfer.bind(this);
	}

	componentDidMount() {
		this.theIPFS = ipfs({
			host: Config.ipfsURL,
			port: Config.ipfsPort,
			protocol: Config.ipfsScheme
		});

		if (!this.state.address) {
			this.getReceipt()
		} else {
			this.getBalance(this.state.address)
		}
	}

	getReceipt() {
		AntennaManager.getReceipt(this.props.hxid, res => {
			if (res === 'ERROR') {
				this.setState({
					isChecking: false
				})
			} else {
				this.setState({
					address: res
				})

				Utilities.saveAddresses('XRC721', {
					tokenName: this.props.tokenName,
					address: res
				})
			}
		})
	}

	onClickRetry() {
		this.getReceipt()
		this.setState({
			isChecking: true
		})
	}

	uploadImage(acceptedFiles) {
		const reader = new FileReader()
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			const binaryStr = reader.result
			this.theIPFS.add(binaryStr).then(file => {
				this.setState({
					ipfsPath: file.path
				})
			})
		}
		reader.readAsArrayBuffer(acceptedFiles[0])
	}

	onSubmit() {
		const buf = Buffer(JSON.stringify(this.theJson), 'utf-8')
		this.theIPFS.add(buf).then(file => {
			if (file && file.path) {
				AntennaManager.mint721(this.state.address, file.path, null, txid => {
					this.getReceiptOfMint(txid)
				})
			}
		});
	}

	onTransfer() {
		AntennaManager.transferNFT(this.state.address, this.state.toAddress, this.state.toTransfer, txid => {
			this.getReceiptOfMint(txid)
			this.setState({
				toTransfer: "",
				toAddress: "",
				isTransferModalShow: false
			})
		})
	}

	getReceiptOfMint(hxid) {
		AntennaManager.getReceipt(hxid, res => {
			if (res === 1) {
				this.getBalance()
			} else {
				setTimeout(() => {
					this.getReceiptOfMint(hxid)
				}, 5000);
			}
		})
	}

	getBalance() {
		AntennaManager.get721BalanceOf(this.state.address, res => {
			this.setState({
				balance: res,
				NFTs: []
			})

			setTimeout(() => {
				this.getNFTs()
			}, 1000);
		})
		return 0
	}

	async getNFTs() {
		let tokenID;
		for (var i = 0; i < this.state.balance; i++) {
			tokenID = await AntennaManager.getNFTByIndex(this.state.address, i)
			this.state.NFTs.push(tokenID)
			this.setState({
				NFTs: [...this.state.NFTs]
			})
		}
	}

	onChangeInput(event) {
		switch (event.target.id) {
			case 'name':
				this.setState({
					name: event.target.value
				})
				break

			case 'description':
				this.setState({
					description: event.target.value
				})
				break

			case 'fileToUpload':
				this.uploadImage(event.target.files)
				break

			default:
				break
		}
	}

	makeJson() {
		this.theJson = {
			name: this.state.name,
			description: this.state.description,
			image: this.state.ipfsPath
		}

		return JSON.stringify(this.theJson)
	}

	onChangeInputAddress() {
		if (AntennaManager.isValidateAddress(this.theAddressInput.value)) {
			this.setState({
				toAddress: this.theAddressInput.value
			})
		} else {
			this.setState({
				toAddress: ""
			})
		}
	}

	onClickTransferLink(event) {
		this.setState({
			toTransfer: event.target.dataset.tokenid,
			isTransferModalShow: true
		});
	}

	onClickCloseTransferModal() {
		this.setState({
			toTransfer: "",
			isTransferModalShow: false
		});
	}

	render() {
		return (
			<div>
				<Line animate layer='success' />

				{!this.state.address && (
					<div className="status">
						<span>Checking: {Utilities.isIoPayMobile() ? this.props.hxid.substr(0, 10) + '...' : this.props.hxid}&nbsp;&nbsp;</span>
						<span>
							{this.state.isChecking ? (
								<Loading animate small />
							) : (
								<Link onClick={this.onClickRetry}>Retry</Link>
							)}
						</span>
					</div>
				)}

				{this.state.address && (
					<div className="tableContainer">
						<div style={{ marginBottom: '1rem' }}>
							<Words animate className="description">XRC721 CONTRACT</Words>
						</div>
						<div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<div className="status">
									<Link href={'https://iotexscan.io/address/' + this.state.address} target="_blank">{this.state.address}</Link>
								</div>
							</Frame>
						</div>

						<div style={{ marginTop: '2rem', marginBottom: 'rem' }}>
							<Words animate className="description">MINT A TOKEN</Words>
						</div>

						<div className="block">
							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary' className="inputWithinFrame">
									<input id="name" className="input" type="text" placeholder="Token Name" onChange={this.onChangeInput} />
								</Frame>
							</div>

							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary' className="inputWithinFrame">
									<input id="description" className="input" type="text" placeholder="Description" onChange={this.onChangeInput} />
								</Frame>
							</div>

							<div>
								<Frame animate={true} level={3} corners={4} layer='primary' className="inputWithinFrame">
									{Utilities.isIoPayMobile() ? (
										<input id="fileToUpload" className="input" style={{ width: '21rem' }} type="file" name="fileToUpload" accept="image/*" onChange={this.onChangeInput} />
									) : (
										<Dropzone onDrop={acceptedFiles => {
											this.uploadImage(acceptedFiles)
										}}>
											{({ getRootProps, getInputProps }) => (
												<section>
													<div style={{ fontSize: 'small', padding: '5rem' }} {...getRootProps()}>
														<input {...getInputProps()} />
														<p>Drag 'n' drop some files here, or click to select files</p>
													</div>
												</section>
											)}
										</Dropzone>
									)}
								</Frame>
							</div>

							{/* <div className="label">IPFS Path: {this.state.ipfsPath}</div> */}

							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary' className="inputWithinFrame">
									<p className="output" style={{ overflow: 'auto' }}>{this.makeJson()}</p>
								</Frame>
							</div>

							<div className="buttons">
								<Button
									onClick={this.props.onCancel}
									className="normalButton"
									animate>Cancel</Button>

								<Button
									disabled={this.state.ipfsPath === ''}
									onClick={this.onSubmit}
									className="normalButton"
									animate
									layer='success'>Mint</Button>
							</div>

							<Line animate layer='success' className="invisibleLine" />
						</div>

						<div className="full" style={{ marginTop: '2rem' }}>
							<div className="label">YOUR NFT ASSET(S): {this.state.balance}</div>

							{this.state.balance > 0 && this.state.NFTs.length > 0 && (<>
								<Frame animate={true} level={3} corners={4} layer='primary'>
									<table width="100%" border="0" style={{
										fontSize: "small",
										margin: "0.5rem",
										borderCollapse: "collapse"
									}}>
										{this.state.NFTs.map(item => (
											<tr className="NFTListItem">
												<td>Token ID: {item}</td>
												<td><Link data-tokenid={item} onClick={this.onClickTransferLink}>Transfer</Link></td>
											</tr>
										))}
									</table>
								</Frame>
							</>)}
						</div>
					</div>
				)}

				<p>&nbsp;</p>
				<Modal
					isOpen={this.state.isTransferModalShow}
					onRequestClose={this.onClickCloseTransferModal}
					style={stylesOfModal}>
					<div className="full">
						<Frame animate={true} level={3} corners={4} layer='primary'>
							<div className="block" style={{ padding: "1rem" }}>
								<div style={{ width: "100%" }}>
									<Frame animate={true} level={3} corners={1} layer='primary' className="inputWithinFrame">
										<input
											ref={node => { this.theAddressInput = node }}
											className="input"
											type="text"
											onChange={debounce(this.onChangeInputAddress, 1500)}
											placeholder="Address" />
									</Frame>
								</div>

								<div className="buttons">
									<Button
										onClick={this.onClickCloseTransferModal}
										className="normalButton"
										animate>Cancel</Button>

									<Button
										disabled={this.state.toTransfer === "" || this.state.toAddress === ""}
										onClick={this.onTransfer}
										className="normalButton"
										animate
										layer='success'>Transfer</Button>
								</div>
							</div>
						</Frame>
					</div>
				</Modal>
			</div>
		)
	}
}

export default ERC721Done
