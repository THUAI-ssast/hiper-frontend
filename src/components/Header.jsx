import { A, Link, useNavigate } from "@solidjs/router";
import { HStack, Heading, Spacer, Box, Button, Image, Anchor, Avatar, Menu, MenuTrigger, MenuItem, MenuContent } from "@hope-ui/solid";
import logo from '../logo.svg';
import { Switch, createEffect, createSignal, onMount, createMemo, Show } from "solid-js";
import "../assets/Avatar.png";
import { checkLoggedIn } from "../utils";


export const [loggedIn, setLoggedIn] = createSignal(false);

function Header() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleRegister() {
    navigate('/register');
  }

  function logOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/');
  }

  onMount(() => {
    checkLoggedIn();
  });

  return (
    <HStack class="header" spacing="10px" borderBottom="1px solid #ccc" boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)">
      <Anchor as={Link} href="/" class="logo">
        <HStack p="$2" spacing="10px">
          <Image src={logo} alt="logo" width="40px" />
          <Heading class="title" size="xl" fontWeight="$bold" fontStyle={"oblique"}>
            Hiper
          </Heading>
        </HStack>
      </Anchor>
      <a href="/">介绍</a>
      <a href="/game">游戏</a>
      <a href="/">房间</a>
      <a href="/">对局</a>
      <a href="/">排行榜</a>
      <a href="/">提交列表</a>

      <Spacer />
      <Show
        when={loggedIn()}
        fallback={() =>
          <>
            <Button onClick={handleLogin} mr="$1" variant="outline">登录</Button>
            <Button onClick={handleRegister} mr="$4" variant="outline">注册</Button>
          </>}
      >
        <Menu closeOnSelect={true}>
          <Avatar as={MenuTrigger} src="https://vip.helloimg.com/images/2023/11/10/odW46g.th.png" height="40px" width="40px" mr="1em" />
          <MenuContent>
            <MenuItem as={Link} href="/user">个人中心</MenuItem>
            <MenuItem as={Link} href="/settings">设置</MenuItem>
            <MenuItem onSelect={logOut} color="red">退出登录</MenuItem>
          </MenuContent>
        </Menu>
      </Show>
    </HStack >
  );
}

export default Header;