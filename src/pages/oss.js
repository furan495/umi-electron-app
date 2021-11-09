import { Table } from 'antd'
import { useState, useEffect } from 'react'

export default props => {

    const { httpRequest } = window
    const { ipcRenderer } = window.electron

    const toDownload = async record => {
        const result =await ipcRenderer.invoke('download', record)
        console.log(result)

    }

    const columns = [
        { title: '文件名', dataIndex: 'fileName' },
        { title: '大小', dataIndex: 'size' },
        { title: '操作', render: (text, record) => <a onClick={e => toDownload(record)}>下载</a> },
    ]

    const [dataSource, setDataSource] = useState([])

    useEffect(async () => {
        const response = await httpRequest.request('data/find', { prefix: 'oss', method: 'POST', body: { prefix: '', searchName: '', isMyData: '' } })
        const folders = response.data?.folders?.map((item, key) => ({ ...item, key })) ?? []
        const files = response.data?.files?.map((item, key) => ({ ...item, key: folders.length + key })) ?? []
        setDataSource([...folders, ...files])
    }, [])

    return (
        <Table
            columns={columns}
            pagination={false}
            dataSource={dataSource}
        />
    )
}