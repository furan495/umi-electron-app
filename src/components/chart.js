import { useEffect } from 'react'
import Highcharts from 'highcharts'
import * as utils from '../utils/utils'
import { formNode } from './components'
import { month2str } from '../utils/resource'
import Cylinder from 'highcharts/modules/cylinder'
import Highcharts3D from 'highcharts/highcharts-3d'
import { Row, Col, Form, Button, Card, Space } from 'antd'

Highcharts3D(Highcharts)
Cylinder(Highcharts)

export const Chart = ({ config }) => {
	useEffect(() => {
		const { type, title, series, categories } = config
		Highcharts.chart('container', {
			series,
			credits: false,
			xAxis: { categories },
			title: { text: title },
			tooltip: { shared: true },
			legend: {
				enabled: type === 'pie',
				layout: 'vertical',
				floating: true,
				itemStyle: { fontSize: 16 },
				x: 180,
				y: -50,
				labelFormatter: function () {
					return `<span>${this.name} (${this.y},  ${this.percentage.toFixed(2)}%)</span>`
				}
			},
			chart: {
				type,
				options3d: {
					enabled: config.show3D,
					alpha: type === 'pie' ? 20 : 10,
				},
			},
			yAxis: {
				title: { text: null },
			},
			plotOptions: {
				series: {
					depth: 45,
					dataLabels: { enabled: true },
				},
				pie: {
					dataLabels: { enabled: false },
					allowPointSelect: true,
					showInLegend: true,
					cursor: 'pointer',
					innerSize: '30%',
					center: [200, 140],
				},
			},
		})
	}, [config])

	return (
		<Card bodyStyle={{ paddingBottom: 0 }}>
			<div id='container'></div>
		</Card>
	)
}

export const ChartSetting = ({ options, config, setConfig }) => {
	const [form] = Form.useForm()

	const submit = async () => {
		const { httpRequest } = window
		const user = JSON.parse(localStorage.getItem('user'))
		const data = await form.validateFields()
		const [start, end] = [data.time[0], data.time[1]]
		const targetProject = `project = ${data.project}`
		const targetUser = '(assignee = currentUser() OR 负责人 = currentUser())'
		const targetDate = `(resolved >= ${start.format('YYYY-MM-DD')} AND resolved<=${end.endOf('month').format('YYYY-MM-DD')})`
		const response = await httpRequest.request(encodeURI(`search?maxResults=-1&jql=${targetDate} AND ${targetProject} AND ${targetUser}`), { ...user, prefix: 'jira' })

		const monthList = nj.arange(start.month() + 1, end.month() + 2).tolist()
		let categories = monthList.map((item) => month2str[item])
		if (data.xAxis === 2) {
			categories = options.issuetype.map(item => item.label).slice(0, 11)
		}
		const series = [{
			color: utils.randomColor(),
			data: utils.dataFilter({ data, monthList, categories, issues: response.issues }),
			name: options.project.find(item => item.value === data.project).label,
		}]
		setConfig({ ...config, ...data, categories, series })
	}

	return (
		<Card hoverable title='图表配置' style={{ height: '100%' }}>
			<Form form={form} hideRequiredMark>
				<Row gutter={[24, 0]}>
					{utils.chartSetting().map((item) => (
						<Col span={item.span} key={item.value}>
							<Form.Item
								name={item.value}
								label={item.label}
								initialValue={item.initialValue}
								rules={[{ required: item.required, message: '字段不能为空' }]}
							>
								{formNode({ item, options })}
							</Form.Item>
						</Col>
					))}
				</Row>
				<Space>
					<Button type='primary' onClick={submit}>绘图</Button>
					<Button onClick={() => form.resetFields()}>重置</Button>
				</Space>
			</Form>
		</Card>
	)
}
