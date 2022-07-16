import React, { Component } from 'react';
import CanvasJSReact from '../../Assets/canvasjs.react'
import { connect } from 'react-redux'
import { dataRangeSelector, statsSelector } from '../../Reducers/selectors'
import { createSelector } from 'reselect';
import { ZIP, TRADE_ZONE} from '../Map/Panels/DemographicsPanel'
import ClipLoader from './ClipLoader'
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const GENDER = 'Gender'
const INCOME = 'Income'
const AGE = 'Age'
 
class DoughnutChart extends Component {

	constructor(props) {
		super(props)

		const { stats } = this.props

		this.state = {
			hasValidData : stats.tradezone === undefined && stats.zip === undefined
		}

		this.chartOptions = this.chartOptions.bind(this)
		this.getDataPoints = this.getDataPoints.bind(this)
		this.selectStats = this.selectStats.bind(this)
	}

	componentDidUpdate(prevProps) {
		const { stats } = this.props
		if (prevProps.stats !== stats) {
			this.setState({ hasValidData:  stats.tradezone === undefined && stats.zip === undefined})
		}
	}


	selectStats = () => {
		switch (this.props.data_range) {
			case ZIP:
				return this.props.stats.zip.stats
			case TRADE_ZONE:
				return this.props.stats.tradezone.stats
			default: return undefined
		}
	}

	getDataPoints = () => {
		let stats = this.selectStats()

		if (stats == undefined) return []	
		let total = 0
		switch (this.props.title) {
			case GENDER: 
				 let genderStats = stats.social.summary.gender
				Object.entries(genderStats).map(([key,  value]) => { total += value})
				return  [
					{name: 'Males', y: 100* (genderStats.males / total).toFixed(1)},
					{name: 'Females', y: 100 * (genderStats.females / total).toFixed(1)}
				]
			case AGE:
				let ageStats = stats.age
				total = ageStats.sample_total
				return [
					{name: '0-9', y: 100* (
						(ageStats.ZERO_FIVE 
						+ ageStats.FIVE_NINE) / total)},
					{name: '10-19', y: 100* (
						   (ageStats.TEN_FOURTEEN  
						 + ageStats.TEN_FOURTEEN
						 + ageStats.EIGHTEEN_NINETEEN) / total)},
					{name: '20-29', y: 100* (
						(ageStats.TWENTY 
							+ ageStats.TWENTYONE
							+ ageStats.TWENTYTWO_TWENTYFOUR
							+ ageStats.TWENTYFIVE_TWENTYNINE)  / total)},
					{name: '30-39', y: 100* (
						(ageStats.THIRTY_THIRTYFOUR 
							+ ageStats.THIRTYFIVE_THIRTYNINE)  / total)},
					{name: '40-49', y: 100* (
						(ageStats.FORTY_FORTYFOUR 
						+ ageStats.FORTYFIVE_FORTYNINE)  / total)},
					{name: '50-59', y: 100* (
						(ageStats.FIFTY_FIFTYFOUR
						+ ageStats.FIFTYFIVE_FIFTYNINE)  / total)},
					{name: '60-69', y: 100* (
						(ageStats.SIXTY_SIXTYONE 
						+ ageStats.SIXTYTWO_SIXTYFOUR
						+ ageStats.SIXTYFIVE_SIXTYSIX
						+ageStats.SIXTYSEVEN_SIXTYNINE)  / total)},
					{name: '70-79', y: 100* (
						(ageStats.SEVENTY_SEVENTYFOUR
						+ ageStats.SEVENTYFIVE_SEVENTYNINE)  / total)},
					{name: '80+', y: 100* (
						(ageStats.EIGHTY_EIGHTYFOUR
						+ ageStats.EIGHTYFIVE_UP)  / total)},
				]
			case INCOME: 
				let incomeStats = stats.income;
				total = stats.income.sample_total
				let data = [
					{name: '0 - 35k', y: (100* (
						(incomeStats._0_9999
						+ incomeStats._10000_14999
						+ incomeStats._15000_19999
						+ incomeStats._20000_24999
						+ incomeStats._25000_29999
						+ incomeStats._30000_34999) / total))},
					{name: '35k - 50k', y: 100 * (
						(incomeStats._35000_39999
						+ incomeStats._40000_44999
						+ incomeStats._45000_49999) / total)},
					{name: '50k - 75k', y: 100 * (
						(incomeStats._50000_59999
						+ incomeStats._60000_74999) / total)},
					{name: '75k - 100k', y: 100 * (
						(incomeStats._75000_99999) / total)},
					{name: '100k - 150k', y: 100 * (
						(incomeStats._100000_124999
						+ incomeStats._125000_149999) / total)},
					{name: '150k - 200k', y: 100 * (
						+ incomeStats._150000_199999) / total},
					{name: '200k+', y: 100 * (incomeStats._200000_MORE / total)}
				]
				return data;
			default: return []
		}
	}

	chartOptions = () => {
		
		return  {
			backgroundColor: this.props.backgroundColor,
			animationEnabled: true,
			subtitles: [{
				text: this.props.title,
				verticalAlign: "center",
				fontSize: 24,
				dockInsidePlotArea: true,
				fontColor: 'white',
			}],
			data: [{
				indexLabelFontColor: "white",
				type: "doughnut",
				showInLegend: true,
				indexLabel: "{name}: {y}",
				yValueFormatString: "#,###'%'",
				dataPoints: this.getDataPoints(),
			}],
			legend: {
				fontColor: 'white'
			}
		}
	}
	render() {
		const { hasValidData } = this.state
		const { data_range, stats, } = this.props
		return (
		<div className="doughnut_chart">
			{data_range === ZIP && stats.zip !== undefined && <CanvasJSChart options = {this.chartOptions()}/>}
			{!hasValidData && data_range === TRADE_ZONE && stats.tradezone !== undefined && <CanvasJSChart options = {this.chartOptions()}/>}
			{!hasValidData && data_range === ZIP && stats.zip === undefined && <ClipLoader/>}
			{!hasValidData && data_range === TRADE_ZONE && stats.tradezone === undefined && <ClipLoader/>}
			{hasValidData && <></>}
		</div>
		);
	}
}


const mapStateToProps = createSelector(
    dataRangeSelector,
    statsSelector,
    (data_range, stats) => ({
        data_range, stats
    })
);

export default connect (mapStateToProps)(DoughnutChart);