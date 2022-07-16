import GaugeChart from 'react-gauge-chart'
import React from 'react';

class Guage extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <GaugeChart id='guage-chart1'
            percent={this.props.percent}
            needleColor={'gray'}
            />
        )
    }
}

export default Guage
