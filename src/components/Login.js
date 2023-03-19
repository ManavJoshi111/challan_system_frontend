import { Button, Form, Input } from 'antd';
import { useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import Cookies from 'js-cookie';
import context from "../Context/userContext.js";
import '../style/login.css'
import { Layout, Menu, theme, message, Result, Spin, Alert } from 'antd';
import Msg from './Msg.js';

const Login = () => {

    const history = useHistory()
    const params = useParams();
    const { person } = params;

    const { user, setUser, nav, setNav, logged, setLogged } = useContext(context);
    const [uname, setUname] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    const [messageApi, contextHolder] = message.useMessage();
    const [load, setLoad] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoad(true)
        const res = await fetch('http://localhost:7100/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ uname, password, person })
        })

        const data = await res.json();
        console.log('data in login :>> ', data);

        if (data.err) {
            window.alert(data.err)
        }
        else if (data.success) {
            setLoad(true)
            if (person === 'admin') {
                setUser({ name: data.aName, id: data.aId });
                setLogged(true);
                history.push('/dashboard')
            }
            if (person === 'police') {
                setUser({ name: data.pName, id: data.pId });
                setLogged(true)
                history.push('/policeForm')
            }
            console.log('msg in login:>> ', msg);
        }
        setLoad(false)
    }

    if (load) {
        return (
            <>
                <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin tip="Checking Credentials... Please wait" size="large" />
                    <Msg msg={msg} />
                </div>
            </>
        )
    } else {
        return (
            <>
                {/* {contextHolder} */}

                <main className='padding-top'>
                    <div class="box">
                        <div class="inner-box">
                            <div className="left">


                                <div class="logo">
                                    <img src="./img/logo.png" alt="logo" />
                                    {/* <h4>Logo</h4> */}
                                </div>

                                <div >
                                    <h2>Welcome Back</h2>
                                    <h5>Login as {person}</h5>
                                </div>
                                <div class="forms-wrap">
                                    <Form name="basic" initialValues={{ remember: true, }} >
                                        <Form.Item
                                            label={person === 'user' ? "mobile" : person + " ID"}
                                            name="userID"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your registered mobile number!',
                                                },
                                            ]}
                                        >
                                            <Input onChange={(e) => setUname(e.target.value)} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your password!',
                                                },
                                            ]}
                                        >
                                            <Input.Password onChange={(e) => setPassword(e.target.value)} />
                                        </Form.Item>


                                        <Form.Item wrapper Col={{ offset: 8, span: 16, }}>
                                            <Button type="primary" htmlType='submit' onClick={handleLogin}>
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <p class="text">
                                        Forgotten your password or you login datails?
                                        <a href="#">Get help</a> signing in
                                    </p>
                                </div>
                            </div>

                            <div className="right">
                                {person === 'admin' &&
                                    <img src="https://niramayamp.nic.in/Resources/Images/Icon/Admin.png" alt="admin" width='70%' height='70%' />}
                                {person === 'police' &&
                                    <img src="https://www.seekpng.com/png/detail/529-5295999_law-enforcement-agency-icon.png" alt="admin" width='100%' height='70%' />}
                                {person === 'user' &&
                                    <img src="https://pngimage.net/wp-content/uploads/2018/06/gambar-user-png-4.png" alt="admin" width='90%' height='60%' />}
                            </div>

                        </div>
                    </div>
                </main>
            </>
        )
    }
};
export default Login;