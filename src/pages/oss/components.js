import { Breadcrumb, Space } from 'antd'

export const OssBreads = ({ dir, search, setSearch, setAction }) => {
    const previous = () => {
        dir.pop()
        setSearch({ ...search, prefix: dir.join('/').slice(5) })
        setAction('GET')
    }

    const breadClick = index => {
        const newDir = dir.slice(0, index + 1)
        setSearch({ ...search, prefix: newDir.join('/').slice(5) })
        setAction('GET')
    }

    return (
        <Space style={{ marginBottom: 24 }}>
            {dir.length > 1 && (<><a onClick={previous}>返回上一级</a><span style={{ color: '#00000073' }}>|</span></>)}
            <Breadcrumb separator='>'>
                {dir.map((bread, index) => (
                    <Breadcrumb.Item key={index} onClick={() => breadClick(index)}>
                        <a className='myBread' style={{ color: index === dir?.length - 1 ? '' : '#1890ff' }}>{bread}</a>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
        </Space>
    )
}