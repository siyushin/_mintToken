import React from 'react';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import Loading from 'arwes/lib/Loading'
import Link from 'arwes/lib/Link'
import Line from 'arwes/lib/Line'
import './Done.css'
import AntennaManager from '../AntennaManager';

class Done extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			balance: 0,
			isChecking: true,
			address: ''
		}

		this.onClickRetry = this.onClickRetry.bind(this)
	}

	componentDidMount() {
		this.getReceipt()
	}

	getReceipt() {
		AntennaManager.getReceipt(this.props.hxid, res => {
			if (res === 'ERROR') {
				this.setState({
					isChecking: false
				})
			} else {
				this.getBalance(res)

				this.setState({
					address: res
				})
			}
		})
	}

	getBalance(address) {
		AntennaManager.getBalanceOf(address, res => {
			this.setState({
				balance: res
			})
		})
		return 0
	}

	onClickRetry() {
		this.getReceipt()
		this.setState({
			isChecking: true
		})
	}

	render() {
		return (<div>
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
			)
			}

			{this.state.address && (
				<div className="tableContainer">
					<div style={{ marginBottom: '1rem' }}>
						<Words animate className="description">THE XRC20 CONTRACT</Words>
					</div>
					<div>
						<Frame animate={true} level={3} corners={4} layer='primary'>
							<Words animate className="label">{this.state.address}</Words>
						</Frame>
					</div>

					<div>
						<div className="h3">
							<Words animate className="description">YOUR XRC20 ASSETS</Words>
						</div>
						<div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<Words animate className="label">{String(this.state.balance)}</Words>
							</Frame>
						</div>
					</div>
				</div>
			)}
		</div >)
	}
}

export default Done