import { useState, useEffect } from 'react'
import { columns } from '../utils/resource'
import { Input, Select, DatePicker, Radio, Form, Row, Col, Space, Button, Card, Table } from 'antd'

const { RangePicker } = DatePicker

export const formNode = ({ item, options }) => {

    const disabledDate = current => {
        const date = new Date()
        return current.year() !== date.getFullYear()
    }


    switch (item.type) {
        case 'select':
            return (
                <Select
                    showSearch
                    placeholder={item.label}
                    options={item.options ?? options[item.value]}
                    filterOption={(input, option) => option.label.includes(input)}
                />
            )
        case 'dateRange':
            return <RangePicker picker='month' disabledDate={disabledDate} style={{ width: '100%' }} />
        case 'radio':
            return <Radio.Group options={item.options} />
        default:
            return <Input placeholder={item.label} />
    }
}

export const TableSearch = ({ options, setAction, setSearch, setPageInfo }) => {

    const [form] = Form.useForm()

    const rangeOptions = [
        { label: '查看所有', value: '' },
        { label: '只看自己', value: '(assignee = currentUser() OR 负责人 = currentUser())' }
    ]

    const formItems = [
        { label: '项目名称', value: 'project', type: 'select' },
        { label: '问题类型', value: 'issuetype', type: 'select' },
        { label: '更新时间', value: 'updated', type: 'dateRange' },
        { label: '搜索范围', value: 'searchRange', type: 'select', options: rangeOptions, initialValue: '' },
    ]

    const valueFormat = item => {
        if (typeof (item[1]) === 'object') {
            return `${item[0]} >= ${item[1]?.[0].startOf('month').format('YYYY-MM-DD')} AND ${item[0]} <= ${item[1]?.[0]?.endOf('month')?.format('YYYY-MM-DD')}`
        }
        return `${item[0]} = ${item[0] === 'issuetype' ? `'${item[1]}'` : item[1]}`
    }

    const searchData = async () => {
        const data = await form.validateFields()
        const entries = Object.entries(data)
        let jql = entries.map(item => valueFormat(item)).filter(item => !item.includes('undefined') && !item.includes('searchRange')).join(' AND ')
        if (data.searchRange) {
            jql += ` AND ${data.searchRange}`
        }
        console.log(jql)
        setSearch(jql)
        setAction('GET')
    }

    const formReset = () => {
        form.resetFields()
        setPageInfo({ pageNo: 1, pageSize: 10, total: 0 })
        setSearch('')
        setAction('GET')
    }

    return (
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={searchData} form={form}>
            <Row type='flex' gutter={[24, 0]}>
                {formItems.map(item => (
                    <Col span={8} key={item.value} >
                        <Form.Item name={item.value} label={item.label} initialValue={item.initialValue}>
                            {formNode({ item, options })}
                        </Form.Item>
                    </Col>
                ))}
                <Col style={{ marginLeft: 'auto' }}>
                    <Space direction='horizontal'>
                        <Button type='primary' htmlType='submit'>查询</Button>
                        <Button onClick={formReset}>重置</Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}

export const IssueTable = ({ options }) => {

    const [search, setSearch] = useState('')
    const [action, setAction] = useState('GET')
    const [dataSource, setDataSource] = useState([])
    const [pageInfo, setPageInfo] = useState({ pageNo: 1, pageSize: 10 })

    useEffect(async () => {
        if (action === 'GET') {
            const { httpRequest } = window
            const user = JSON.parse(localStorage.getItem('user'))
            const startAt = (pageInfo.pageNo - 1) * pageInfo.pageSize
            const response = await httpRequest.request(encodeURI(`search?startAt=${startAt}&maxResults=${pageInfo.pageSize}&jql=${search}`), {...user,prefix:'jira'})
            const data = response.issues?.map(item => ({ key: item.key, ...item.fields }))
            setAction('')
            setDataSource(data)
            setPageInfo({ ...pageInfo, pageSize: response.maxResults, total: response.total })
        }
    }, [action])

    const onChange = (e) => {
        setPageInfo({ ...pageInfo, pageNo: e.current, pageSize: e.pageSize, })
        setAction('GET')
    }

    const pagination = {
        ...pageInfo,
        current: pageInfo.pageNo,
        showTotal: () => `共 ${pageInfo.total} 条数据`
    }

    return (
        <Card hoverable title={
            <TableSearch options={options} setAction={setAction} setPageInfo={setPageInfo} setSearch={setSearch} />
        }>
            <Table
                columns={columns}
                onChange={onChange}
                dataSource={dataSource}
                pagination={pagination}
                loading={action === 'GET'}
            />
        </Card>
    )
}