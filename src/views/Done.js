import React from 'react';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import Line from 'arwes/lib/Line'
import './Done.css'
import AntennaManager from '../AntennaManager';

class Done extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			balance: 0
		}
	}

	getBalance() {
		AntennaManager.getBalanceOf(this.props.address, res => {
			this.setState({
				balance: res
			})
		})
		return 0
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

				{this.props.address != '' ? (
					<div>
						<div className="block">
							<Words animate className="description">YOUR XRC20 ASSETS</Words>
						</div>
						<div>
							<Frame animate={true} level={3} corners={4} layer='primary'>
								<Words animate className="label">{String(this.state.balance)}</Words>
							</Frame>
						</div>
					</div>
				) : null}
			</div>
		</div>)
	}
}

export default Done