import moment from 'moment'
import { chartTypes } from './resource'

export const chartSetting = () => {

    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const show3dOptions = [{ label: '是', value: true }, { label: '否', value: false }]
    const xAxisOptions = [{ label: '时间(月)', value: 1 }, { label: '问题类型', value: 2 }]

    return [
        { label: '图表标题', value: 'title', type: 'text', initialValue: '问题统计', span: 24 },
        { label: '项目名称', value: 'project', type: 'select', initialValue: 'CLOUD', required: true, span: 24 },
        { label: '是否3D', value: 'show3D', type: 'radio', initialValue: false, span: 24, options: show3dOptions },
        { label: '图表类型', value: 'type', type: 'select', options: chartTypes, initialValue: 'column', span: 12 },
        { label: '横轴类型', value: 'xAxis', type: 'select', initialValue: 1, options: xAxisOptions, span: 12 },
        {
            label: '起始日期', value: 'time', type: 'dateRange', span: 24,
            initialValue: [moment(`${year}/1`, 'YYYY/MM'), moment(`${year}/${month}`, 'YYYY/MM')]
        },
    ]
}

export const randomColor = () => {
    const color = `#${Math.random().toString(16).slice(-6)}`
    const stops = [[0, `${color}44`], [1, `${color}ff`]]
    const linearGradient = { x1: 0, x2: 0, y1: 0, y2: 1 }
    return { linearGradient, stops }
}

export const dataFilter = ({ data, monthList, categories, issues }) => {
    if (data.xAxis === 1) {
        return monthList.map(item => item < 10 ? `0${item}` : item).map(item => {
            const counts = issues.map(item => item.fields.resolutiondate.slice(0, 7)).filter(d => d?.includes(`-${item}`)).length
            return counts === 0 ? null : counts
        })
    } else {
        return categories.map(item => {
            const counts = issues.filter(issue => issue.fields.issuetype.name === item).length
            return counts === 0 ? null : counts
        })
    }
}
