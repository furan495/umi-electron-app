import moment from 'moment'

const columnRender = (text, isTime = false) => {
    if (typeof (text) === 'object') {
        return text?.displayName ?? text?.name ?? ''
    } else {
        if (isTime) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
        return text
    }
}

export const columns = [
    { title: '关键字', dataIndex: 'key', render: text => columnRender(text) },
    { title: '问题概要', dataIndex: 'summary', render: text => columnRender(text) },
    { title: '负责人', dataIndex: 'customfield_10100', render: text => columnRender(text) },
    { title: '经办人', dataIndex: 'assignee', render: text => columnRender(text) },
    { title: '项目名称', dataIndex: 'project', render: text => columnRender(text) },
    { title: '问题类型', dataIndex: 'issuetype', render: text => columnRender(text) },
    { title: '更新时间', dataIndex: 'updated', render: text => columnRender(text, true) },
]

export const chartTypes = [
    { label: '折线图', value: 'line' },
    { label: '曲线图', value: 'spline' },
    { label: '柱形图', value: 'column' },
    { label: '圆柱图', value: 'cylinder' },
    { label: '折线面积图', value: 'area' },
    { label: '曲线面积图', value: 'areaspline' },
]

export const month2str = { 1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月', 7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月' }