import zhCN from 'antd/lib/locale/zh_CN'
import { useState, useEffect } from 'react'
import { Row, Col, ConfigProvider } from 'antd'
import { IssueTable } from '../components/components'
import { Chart, ChartSetting } from '../components/chart'

export default props => {

  const [options, setOptions] = useState({})
  const [config, setConfig] = useState({ title: '', type: 'column', series: [], categories: [] })

  useEffect(async () => {
    const { httpRequest } = window
    const user = JSON.parse(localStorage.getItem('user'))
    const project = await httpRequest.request('project', { ...user, prefix: 'jira' })
    const issuetype = await httpRequest.request('issuetype', { ...user, prefix: 'jira' })
    const targetUser = '(assignee= currentUser() OR 负责人 = currentUser())'
    const targetDate = '(resolved >= startOfYear() AND resolved <= endOfYear())'
    const response = await httpRequest.request(encodeURI(`search?maxResults=-1&jql=${targetDate} AND ${targetUser}`), { ...user, prefix: 'jira' })
    const myProjects = response.issues.map(issue => issue.fields.project.name)
    const projectSets = Array.from(new Set(myProjects))
    const data = projectSets.map(item => ({ name: item, y: myProjects.filter(pro => pro === item).length }))
    setConfig({ title: '当年项目问题统计', type: 'pie', show3D: true, series: [{ name: '问题总数', data }] })
    setOptions({
      issuetype: issuetype.map(item => ({ label: item.name, value: item.name })),
      project: project.map(item => ({ label: item.name, value: item.key }))
    })
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <Row gutter={[24, 24]} style={{ padding: 24 }}>
        <Col span={16}>
          <Chart config={config} />
        </Col>
        <Col span={8}>
          <ChartSetting options={options} config={config} setConfig={setConfig} />
        </Col>
        <Col span={24}>
          <IssueTable options={options} />
        </Col>
      </Row>
    </ConfigProvider>
  )
}