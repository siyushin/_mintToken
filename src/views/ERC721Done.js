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

class ERC721Done extends React.Component {
	constructor(props) {
		super(props)

		this.theIPFS = null
		this.theJson = null
		this.state = {
			ipfsPath: '',
			balance: 0,
			name: '',
			description: '',
			isChecking: true,
			address: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChangeInput = this.onChangeInput.bind(this)
		this.onClickRetry = this.onClickRetry.bind(this)
	}

	componentDidMount() {
		this.theIPFS = ipfs({
			host: Config.ipfsURL,
			port: Config.ipfsPort,
			protocol: Config.ipfsScheme
		});

		this.getReceipt()
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
				AntennaManager.mint721(this.state.address, file.path, txid => {
					this.getReceiptOfMint(txid)
					this.setState({
						balance: -1
					})
				})
			}
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
				balance: res
			})
		})
		return 0
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

	render() {
		return (
			<div>
				<Line animate layer='success' />

				{!this.state.address && (
					<div className="status">
						<span>Checking: {this.props.hxid}&nbsp;&nbsp;</span>
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
								<Words animate className="label">{this.state.address}</Words>
							</Frame>
						</div>

						<div style={{ marginTop: '2rem', marginBottom: 'rem' }}>
							<Words animate className="description">MINT THE FIRST</Words>
						</div>

						<div className="block">
							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary'>
									<input id="name" className="input" type="text" placeholder="Token Name" onChange={this.onChangeInput} />
								</Frame>
							</div>

							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary'>
									<input id="description" className="input" type="text" placeholder="Description" onChange={this.onChangeInput} />
								</Frame>
							</div>

							<div>
								<Frame animate={true} level={3} corners={4} layer='primary'>
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
								</Frame>
							</div>

							{/* <div className="label">IPFS Path: {this.state.ipfsPath}</div> */}

							<div className="full">
								<Frame animate={true} level={3} corners={4} layer='primary'>
									<p className="output" style={{ overflow: 'scroll' }}>{this.makeJson()}</p>
								</Frame>
							</div>

							<div className="buttons">
								<Button
									onClick={this.props.onCancel}
									animate layer='success'>Cancel</Button>
								<Button
									disabled={this.state.ipfsPath === ''}
									onClick={this.onSubmit}
									animate layer='success'>Mint</Button>
							</div>

							<Line animate layer='success' />
						</div>

						<div style={{ marginTop: '2rem' }}>
							<div className="label">YOUR NFT ASSETS</div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								{this.state.balance === -1 ? (
									<div className="label">
										<Loading animate small />
									</div>
								) : (
										<div className="label">{this.state.balance}</div>
									)}
							</Frame>
						</div>
					</div>
				)}
			</div>
		)
	}
}

export default ERC721Done
