import { history } from 'umi'
import * as THREE from 'three'
import styles from './index.less'
import { useEffect } from 'react'
import bug from '../assets/bug.png'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

export default props => {

    const [form] = Form.useForm()

    const onFinish = async () => {
        const { httpRequest } = window
        const data = await form.validateFields()
        localStorage.setItem('user', JSON.stringify(data))
        const response = await httpRequest.request('search?startAt=0&maxResults=10&jql=', { ...data, prefix: 'jira' })
        if (response.maxResults === 10) {
            history.push('jira')
        } else {
            message.error('用户名或密码错误')
        }
    }

    useEffect(() => {
        const particleCount = 500
        let camera, scene, renderer
        let pointCloud, positions
        const particlesData = nj.arange(particleCount).tolist()
            .map(item => new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2))

        init()
        animate()

        function init() {
            const group = new THREE.Group()
            const container = document.getElementById('container')
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000)
            camera.position.z = 1000
            scene = new THREE.Scene()
            scene.add(group)

            const particles = new THREE.BufferGeometry()
            const texture = new THREE.TextureLoader().load(bug)
            const pMaterial = new THREE.PointsMaterial({ size: 32, depthTest: false, transparent: true, map: texture })
            positions = new Float32Array(particleCount * 3).map(item => Math.random() * window.innerHeight - window.innerHeight / 2)
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            pointCloud = new THREE.Points(particles, pMaterial)
            group.add(pointCloud)

            renderer = new THREE.WebGLRenderer()
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight)
            container.appendChild(renderer.domElement)
        }

        function animate() {
            for (let i = 0; i < particleCount; i++) {
                const particleData = particlesData[i]
                positions[i * 3] += particleData.x
                positions[i * 3 + 1] += particleData.y
                positions[i * 3 + 2] += particleData.z
                if (Math.abs(positions[i * 3]) > window.innerWidth / 2) {
                    particleData.x *= -1
                }
                if (Math.abs(positions[i * 3 + 1]) > window.innerHeight / 2) {
                    particleData.y *= -1
                }
                if (Math.abs(positions[i * 3 + 2]) > window.innerHeight / 2) {
                    particleData.z *= -1
                }
            }
            pointCloud.geometry.attributes.position.needsUpdate = true
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }

    }, [])

    return (
        <div id='container' className={styles.flexCenter}>
            <Card className={styles.login}>
                <Form form={form} onFinish={onFinish} style={{ width: 300 }}>
                    <Form.Item name='name' initialValue='chunhuizhang' rules={[{ required: true, message: '用户名不能为空!' }]}>
                        <Input autoComplete='off' prefix={<UserOutlined />} placeholder='用户名' />
                    </Form.Item>
                    <Form.Item name='pwd' initialValue='123456a' rules={[{ required: true, message: '密码不能为空!' }]}>
                        <Input prefix={<LockOutlined />} type='password' placeholder='密码' />
                    </Form.Item>
                    <Button htmlType='submit'>登录</Button>
                </Form>
            </Card>
        </div>
    )
}