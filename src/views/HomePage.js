import React from 'react';
import Button from 'arwes/lib/Button';
import Link from 'arwes/lib/Link';
import Frame from 'arwes/lib/Frame'
import './HomePage.css'
import Utilities from '../Utilities';
import AntennaManager from '../AntennaManager';

class HomePage extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			XRC20: [],
			XRC721: [],
			typingValue: '',
			typingValue721: ''
		}

		this.onChangeInput = this.onChangeInput.bind(this)
		this.checkAddress = this.checkAddress.bind(this)
		this.checkAddress721 = this.checkAddress721.bind(this)
	}

	componentDidMount() {
		this.setState({
			XRC20: Utilities.getAddresses('XRC20'),
			XRC721: Utilities.getAddresses('XRC721')
		})
	}

	onChangeInput(event) {
		if (event.target.id === 'i20') {
			this.setState({
				typingValue: event.target.value
			})
		} else {
			this.setState({
				typingValue721: event.target.value
			})
		}
	}

	checkAddress() {
		if (!AntennaManager.isValidateAddress(this.state.typingValue)) {
			window.alert('Invalid address.')
		} else {
			this.props.jumpTo({
				tokenName: '',
				address: this.state.typingValue
			})
		}
	}

	checkAddress721() {
		if (!AntennaManager.isValidateAddress(this.state.typingValue721)) {
			window.alert('Invalid address.')
		} else {
			this.props.jumpTo721({
				tokenName: '',
				address: this.state.typingValue721
			})
		}
	}

	render() {
		return (
			<div className="buttonBlockHomepage">
				<Frame
					animate={true}
					level={3}
					corners={4}
					layer='primary'>
					<div className="innerFrame">
						<Button animate className="button" onClick={this.props.onClickERC20}>XRC 20</Button>

						<div className="list">
							{this.state.XRC20 && this.state.XRC20.length > 0 && (
								<div>
									<div className="h4">Token Created</div>
									<div className="listContainer">
										{this.state.XRC20.map(item => (
											<div key={item.address}>
												<Link onClick={() => {
													this.props.jumpTo(item)
												}}>{item.tokenName}</Link>
											</div>
										))}
									</div>
								</div>
							)}

							<div>
								<div className="h4">Custom Contract Address</div>
								<div>
									<span>
										<input
											className="lightInput"
											id="i20"
											onChange={this.onChangeInput}
											placeholder="Contract Address" />&nbsp;
				</span>
									<span>
										<Link onClick={this.checkAddress}>OPEN</Link>
									</span>
								</div>
							</div>
						</div>
					</div>
				</Frame>

				<Frame
					animate={true}
					level={3}
					corners={4}
					className="frame"
					layer='primary'>
					<div className="innerFrame">
						<Button animate className="button" onClick={this.props.onClickERC721}>XRC 721</Button>

						<div className="list">
							{this.state.XRC721 && this.state.XRC721.length > 0 && (
								<div>
									<div className="h4">Token Created</div>
									<div className="listContainer">
										{this.state.XRC721.map(item => (
											<div key={item.address}>
												<Link onClick={() => {
													this.props.jumpTo721(item)
												}}>{item.tokenName}</Link>
											</div>
										))}
									</div>
								</div>
							)}

							<div>
								<div className="h4">Custom Contract Address</div>
								<div>
									<span>
										<input
											className="lightInput"
											id="i721"
											onChange={this.onChangeInput}
											placeholder="Contract Address" />&nbsp;
									</span>
									<span>
										<Link onClick={this.checkAddress721}>OPEN</Link>
									</span>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</div>
		)
	}
}

export default HomePage