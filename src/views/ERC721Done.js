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

		this.state = {
			ipfsPath: '',
			nfts: []
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	uploadImage(acceptedFiles) {
		const reader = new FileReader()
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			const binaryStr = reader.result
			let theIPFS = ipfs({ host: Config.ipfsURL, port: Config.ipfsPort, protocol: Config.ipfsScheme });
			theIPFS.add(binaryStr).then(file => {
				this.setState({
					ipfsPath: file.path
				})
			})
		}
		reader.readAsArrayBuffer(acceptedFiles[0])
	}

	onSubmit() {
		AntennaManager.mint721(this.props.address, this.state.ipfsPath, txid => {
			this.state.nfts.push(txid)
			this.setState({
				nfts: [...this.state.nfts]
			})
		})
	}

	render() {
		return (<div>
			<Line animate layer='success' />
			<div className="tableContainer">
				<div style={{ marginBottom: '1rem' }}>
					<Words animate className="description">YOUR CONTRACT</Words>
				</div>
				<div>
					<Frame animate={true} level={3} corners={4} layer='primary'>
						<Words animate className="label">{this.props.address}</Words>
					</Frame>
				</div>

				<div style={{ marginTop: '1rem' }}>
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

				<div className="buttons">
					<Button
						onClick={this.props.onCancel}
						animate layer='success'>Cancel</Button>
					<Button
						disabled={this.state.ipfsPath === ''}
						onClick={this.onSubmit}
						animate layer='success'>Submit</Button>
				</div>

				{this.state.nfts.length > 0 ? (
					<div style={{ marginTop: '2rem' }}>
						<div className="label">YOUR NFTS</div>
						{this.state.nfts.map(item => (
							<div className="label">{item}</div>
						))}
					</div>
				) : null}
			</div>
		</div>)
	}
}

export default ERC721Done