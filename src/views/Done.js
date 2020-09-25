import React from 'react';
import Words from 'arwes/lib/Words'
import Frame from 'arwes/lib/Frame'
import Line from 'arwes/lib/Line'
import './Done.css'

class Done extends React.Component {
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
			</div>
		</div>)
	}
}

export default Done