import { createSignal, onMount } from "solid-js";
import { Input, Button, VStack, Spacer, HStack, Anchor } from "@hope-ui/solid";
import { FormControl, FormLabel } from "@hope-ui/solid";
import { Link, useNavigate } from "@solidjs/router";

import { apiUrl } from "../utils";
import { getCurrentUser } from "../App";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = createSignal({
        account: '',
        password: ''
    });

    function handleSubmit(event) {
        event.preventDefault();
        // 在这里处理表单提交逻辑，发送验证码等
        let body = {}
        if (formData().account.includes('@')) {
            body = {
                'email': formData().account,
                'password': formData().password
            }
        } else {
            body = {
                'username': formData().account,
                'password': formData().password
            }
        }
        fetch(`${apiUrl}/user/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                const accessToken = data.access_token;
                localStorage.setItem('jwt', accessToken);
                getCurrentUser();
                navigate('/');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    return (
        <form onSubmit={handleSubmit} >
            <VStack margin="auto" maxW="400px">
                <FormControl margin="10px">
                    <FormLabel for="username">邮箱/用户名</FormLabel>
                    <Input type="text" value={formData().account} onInput={(e) => setFormData({ ...formData(), account: e.target.value })} />
                </FormControl>

                <FormControl margin="10px">
                    <FormLabel for="password">密码</FormLabel>
                    <Input type="password" value={formData().password} onInput={(e) => setFormData({ ...formData(), password: e.target.value })} />
                </FormControl>

                <HStack width="400px">
                    <Anchor as={Link} href="/register" margin="10px">
                        还没有账号？去注册
                    </Anchor>
                    <Spacer dir="auto" />
                    <Anchor as={Link} href="/reset" margin="10px">
                        忘记密码？
                    </Anchor>
                </HStack>

                <Button id="loginButton" type="submit" margin="10px">登录</Button>

            </VStack>
        </form>
    );
}