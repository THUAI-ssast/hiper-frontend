import { createEffect, createSignal, Show } from "solid-js";
import { Input, Button, VStack, HStack } from "@hope-ui/solid";
import { FormControl, FormLabel, FormErrorMessage } from "@hope-ui/solid";

export default function ResetPassword() {
    const [emailStatus, setEmailStatus] = createSignal(false);
    const [verifyCodeStatus, setVerifyCodeStatus] = createSignal(false);
    const [passwordStatus, setPasswordStatus] = createSignal(false);
    const [confirmPasswordStatus, setConfirmPasswordStatus] = createSignal(false);

    const [countDown, setCountDown] = createSignal(0);

    const [formData, setFormData] = createSignal({
        email: '',
        password: '',
        confirmPassword: '',
        verifyCode: ''
    });

    createEffect(() => {
        if (countDown() > 0) {
            setTimeout(() => {
                setCountDown(countDown() - 1);
            }, 1000);
        }
    });

    function handleSubmit(event) {
        event.preventDefault();
        // 在这里处理表单提交逻辑，发送验证码等

    }

    function sendVerifyCode() {
        // 在这里发送验证码
        fetch('http://127.0.0.1:4523/m1/3494933-0-default/users/request-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData().email })
        })
            .then(data => {
                console.log(data);
            });
        setCountDown(60);
    }

    function emailInvalid() {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(formData().email)) {
            return true;
        }
        return false;
    }

    function emailUpdate(event) {
        setFormData({ ...formData(), email: event.target.value });
        setEmailStatus(emailInvalid());
    }

    function passwordInvalid() {
        if (formData().password.length < 8 || formData().password.length > 16) {
            return true;
        }
        return false;
    }


    function passwordUpdate(event) {
        setFormData({ ...formData(), password: event.target.value });
        setPasswordStatus(passwordInvalid());
    }

    function confirmPasswordInvalid() {
        if (formData().password != formData().confirmPassword) {
            return true;
        }
        return false;
    }

    function confirmPasswordUpdate(event) {
        setFormData({ ...formData(), confirmPassword: event.target.value });
        setConfirmPasswordStatus(confirmPasswordInvalid());
    }

    function verifyCodeInvalid() {
        if (formData().verifyCode.length != 6) {
            return true;
        }
        return false;
    }

    function verifyCodeUpdate(event) {
        const pattern = /^[0-9]+$/;
        if (!pattern.test(event.target.value)) {
            event.target.value = event.target.value.slice(0, -1);
        }
        setFormData({ ...formData(), verifyCode: event.target.value });
        setVerifyCodeStatus(verifyCodeInvalid());
    }

    return (
        <form onSubmit={handleSubmit} >
            <VStack margin="auto" maxW="400px">

                <FormControl required margin="10px" invalid={emailStatus()}>
                    <FormLabel for="email">邮箱</FormLabel>
                    <Input id="verify" type="email" value={formData().email} onInput={(e) => emailUpdate(e)} />
                    <Show
                        when={emailInvalid()}
                    >
                        <FormErrorMessage>请输入邮箱</FormErrorMessage>
                    </Show>
                </FormControl>

                <FormControl required margin="10px" invalid={verifyCodeStatus()}>
                    <FormLabel for="verifyCode">验证码</FormLabel>
                    <HStack>
                        <Input type="text" marginRight="10px" value={formData().verifyCode} onInput={(e) => verifyCodeUpdate(e)} />
                        <Button variant="outline" width="160px" disabled={countDown() > 0 || emailStatus() || !formData().email} onclick={sendVerifyCode} >{countDown() > 0 ? `${countDown()}s` : '发送验证码'}</Button>
                    </HStack>
                    <Show
                        when={verifyCodeInvalid()}
                    >
                        <FormErrorMessage>验证码长度为6</FormErrorMessage>
                    </Show>
                </FormControl>

                <FormControl required margin="10px" invalid={passwordStatus()}>
                    <FormLabel for="password">新密码</FormLabel>
                    <Input type="password" value={formData().password} onInput={(e) => passwordUpdate(e)} />
                    <Show
                        when={passwordInvalid()}
                    >
                        <FormErrorMessage>密码长度至少为8</FormErrorMessage>
                    </Show>
                </FormControl>

                <FormControl required margin="10px" invalid={confirmPasswordStatus()}>
                    <FormLabel for="confirmPassword">确认新密码</FormLabel>
                    <Input type="password" value={formData().confirmPassword} onInput={(e) => confirmPasswordUpdate(e)} />
                    <Show
                        when={confirmPasswordInvalid()}
                    >
                        <FormErrorMessage>密码前后不一致</FormErrorMessage>
                    </Show>
                </FormControl>

                <Button id="submitButton" disabled={emailStatus() || passwordStatus() || confirmPasswordStatus() || verifyCodeStatus()} type="submit" margin="10px">重置密码</Button>
            </VStack>
        </form>
    );
}