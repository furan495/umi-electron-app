import moment from 'moment'
import { Table, Card } from 'antd'
import { OssBreads } from './components'
import { useState, useEffect } from 'react'
import { FolderOutlined } from '@ant-design/icons'

export default props => {

    const { httpRequest } = window
    const { ipcRenderer } = window.electron

    const [dir, setDir] = useState(['全部文件'])
    const [action, setAction] = useState('GET')
    const [dataSource, setDataSource] = useState([])
    const [search, setSearch] = useState({ prefix: '', searchName: '', isMyData: '' })

    useEffect(async () => {
        if (action === 'GET') {
            const response = await httpRequest.request('data/find', { method: 'POST', body: search })
            const folders = response.data?.folders?.map((item, key) => ({ ...item, key })) ?? []
            const files = response.data?.files?.map((item, key) => ({ ...item, key: folders.length + key })) ?? []
            setDir([dir[0], ...search.prefix.split('/')].filter(item => item !== ''))
            setDataSource([...folders, ...files])
            setAction('')
        }
    }, [action])

    const onRow = record => {
        return {
            onClick: e => {
                if (record.isDirectory === 1) {
                    setSearch({ ...search, prefix: `${record.path ?? ''}${record.path ? '/' : ''}${record.fileName}` })
                    setAction('GET')
                }
            }
        }
    }

    const timeRender = data => data === 0 ? '-' : moment(data).format('YYYY-MM-DD HH:mm')

    const sizeRender = data => {
        if (data === 0) {
            return '-'
        } else if (data < 1024) {
            return `${data}B`
        } else if (data < 1024 * 1024) {
            return `${(data / 1024).toFixed(2)}KB`
        } else if (data < 1024 * 1024 * 1024) {
            return `${(data / 1024 / 1024).toFixed(2)}MB`
        } else if (data < 1024 * 1024 * 1024 * 1024) {
            return `${(data / 1024 / 1024 / 1024).toFixed(2)}GB`
        } else {
            return `${(data / 1024 / 1024 / 1024 / 1024).toFixed(2)}T`
        }
    }

    const toDownload = async (e, record) => {
        e.preventDefault()
        e.stopPropagation()
        console.log(await ipcRenderer.invoke('download', record))
    }

    const columns = [
        {
            title: '文件名', dataIndex: 'fileName', render: (text, record) => (
                <>
                    {record.isDirectory === 1 && <FolderOutlined style={{ marginRight: 6 }} />}
                    {text}
                </>
            ),
        },
        { title: '大小', dataIndex: 'size', width: '15%', render: text => sizeRender(text) },
        { title: '修改日期', dataIndex: 'updateTime', width: '15%', ellipsis: true, render: text => timeRender(text) },
        { title: '操作', width: '10%', render: (text, record) => <a onClick={e => toDownload(e, record)}>下载</a> },
    ]

    return (
        <Card bordered={false}>
            <OssBreads dir={dir} search={search} setSearch={setSearch} setAction={setAction} />
            <Table
                size='small'
                onRow={onRow}
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                loading={action === 'GET'}
            />
        </Card>
    )
}