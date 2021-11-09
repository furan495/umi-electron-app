import moment from 'moment'
import { Table } from 'antd'
import { useState, useEffect } from 'react'
import { FolderOutlined, FileOutlined } from '@ant-design/icons'

export default props => {

    const { httpRequest } = window
    const { ipcRenderer } = window.electron

    const [action, setAction] = useState('GET')
    const [dataSource, setDataSource] = useState([])
    const [body, setBody] = useState({ prefix: '', searchName: '', isMyData: '' })

    useEffect(async () => {
        if (action === 'GET') {
            const response = await httpRequest.request('data/find', { prefix: 'oss', method: 'POST', body })
            const folders = response.data?.folders?.map((item, key) => ({ ...item, key })) ?? []
            const files = response.data?.files?.map((item, key) => ({ ...item, key: folders.length + key })) ?? []
            setDataSource([...folders, ...files])
            setAction('')
        }
    }, [action])

    const onRow = record => {
        return {
            onClick: e => {
                if (record.isDirectory === 1) {
                    setBody({ ...body, prefix: `${record.path ?? ''}${record.path ? '/' : ''}${record.fileName}` })
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
        const result = await ipcRenderer.invoke('download', record)
        console.log(result)
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
        { title: '修改日期', dataIndex: 'updateTime', width: '15%', render: text => timeRender(text) },
        { title: '操作', width: '15%', render: (text, record) => record.isDirectory === 2 && <a onClick={e => toDownload(e, record)}>下载</a> },
    ]


    return (
        <Table
            onRow={onRow}
            columns={columns}
            pagination={false}
            dataSource={dataSource}
            loading={action === 'GET'}
        />
    )
}