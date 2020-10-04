import React from 'react';
import Words from 'arwes/lib/Words'
import Button from 'arwes/lib/Button'
import Frame from 'arwes/lib/Frame'
import Line from 'arwes/lib/Line'
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
			description: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChangeInput = this.onChangeInput.bind(this)
	}

	componentDidMount() {
		this.theIPFS = ipfs({
			host: Config.ipfsURL,
			port: Config.ipfsPort,
			protocol: Config.ipfsScheme
		});
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
				AntennaManager.mint721(this.props.address, file.path, txid => {
					this.state.nfts.push(txid)

					setTimeout(() => {
						this.getBalance()
					}, 15000);
				})
			}
		})
	}

	getBalance() {
		AntennaManager.get721BalanceOf(this.props.address, res => {
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
				<div className="tableContainer">
					<div style={{ marginBottom: '1rem' }}>
						<Words animate className="description">YOUR CONTRACT</Words>
					</div>
					<div>
						<Frame animate={true} level={3} corners={4} layer='primary'>
							<Words animate className="label">{this.props.address}</Words>
						</Frame>
					</div>

					<div className="block">
						<Line animate layer='success' />

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

						<div className="label">IPFS Path: {this.state.ipfsPath}</div>

						<div className="full">
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<div className="output">{this.makeJson()}</div>
							</Frame>
						</div>

						<div className="buttons">
							<Button
								onClick={this.props.onCancel}
								animate layer='success'>Cancel</Button>
							<Button
								disabled={this.state.ipfsPath === ''}
								onClick={this.onSubmit}
								animate layer='success'>Save</Button>
						</div>

						<Line animate layer='success' />
					</div>

					{this.props.address != 0 ? (
						<div style={{ marginTop: '2rem' }}>
							<div className="label">YOUR NFT ASSETS</div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<div className="label">{this.state.balance}</div>
							</Frame>
						</div>
					) : null}
				</div>
			</div>
		)
	}
}

export default ERC721Done
