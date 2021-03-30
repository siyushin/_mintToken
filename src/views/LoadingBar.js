import React from 'react'
import Loading from 'arwes/lib/Loading'
import Button from 'arwes/lib/Button'

class LoadingBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			cacelable: false
		}

		this.confirm = this.confirm.bind(this)
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({
				cacelable: true
			})
		}, 15000);
	}

	confirm() {
		if (window.confirm('Would you like to stop this transaction?')) {
			this.props.onCancel()
		}
	}

	render() {
		return (
			<div>
				<div style={{ position: 'relative', width: '100%', height: 200 }}>
					<Loading animate full />
				</div>

				{this.state.cacelable ? (
					<Button
						onClick={this.confirm}
						animate layer='success'>Cancel</Button>
				) : null}
			</div>
		)
	}
}

export default LoadingBar