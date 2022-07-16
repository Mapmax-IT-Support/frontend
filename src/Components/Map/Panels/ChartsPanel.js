import React, { Component } from 'react'
import DoughnutChart from '../../UI/DoughnutChart'

const lightBg = 'rgb(31,33,48)'

class ChartsPanel extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="chartPanel_container">
                <DoughnutChart title={'Gender'} backgroundColor={lightBg}></DoughnutChart>
                <DoughnutChart title={'Income'} backgroundColor={lightBg}></DoughnutChart>
                <DoughnutChart title={'Age'} backgroundColor={lightBg} ></DoughnutChart>
            </div>
        )
    }
}

export default ChartsPanel