import { A, Link, useNavigate } from "@solidjs/router";
import { HStack, Heading, Spacer, Box, Button, Image, Anchor, Avatar, Menu, MenuTrigger, MenuItem, MenuContent } from "@hope-ui/solid";
import logo from '../logo.svg';
import { createEffect, createSignal, onMount, createMemo, Show } from "solid-js";
import "../assets/Avatar.png";
import { checkLoggedIn } from "../utils";
import { apiUrl } from "../utils";


export const [loggedIn, setLoggedIn] = createSignal(false);

function Header() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleRegister() {
    navigate('/register');
  }

  function handleHomepage() {
    navigate('/');
  }

  function logOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/');
  }

  function Redirect() {
    fetch(`${apiUrl}/user`, {
      "method": 'GET',
      "headers": {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        navigate(`/users/${data.username}`);
      })
  }

  const [bgColor, setBgColor] = createSignal("initialColor");

  const handleMouseEnter = () => {
    setBgColor("#eeeeee");
  };

  const handleMouseLeave = () => {
    setBgColor("initialColor");
  };

  createEffect(() => {
    setLoggedIn(checkLoggedIn());
  });

  return (
    <HStack class="header" spacing="10px" borderBottom="1px solid #ccc" boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)">
      <HStack p="$2" spacing="10px" onClick={handleHomepage}
        onMouseEnter={handleMouseEnter} // Add this line
        onMouseLeave={handleMouseLeave} // Add this line
        style={`background-color: ${bgColor()}; transition: background-color 0.3s ease;`} // Add this line
      >
        <Image src={logo} alt="logo" width="40px" />
        <Heading class="title" size="xl" fontWeight="$bold" fontStyle={"oblique"}>
          Hiper
        </Heading>
      </HStack>

      <HStack spacing="10px">
        <Button as={Link} href="/games" variant="ghost" color="black" fontSize="$l">游戏</Button>
        <Button as={Link} href="/contests" variant="ghost" color="black" fontSize="$l">比赛</Button>
      </HStack>

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
          <Avatar as={MenuTrigger} src="https://vip.helloimg.com/images/2023/11/10/odW46g.th.png" margin="5px" />
          <MenuContent>
            <MenuItem onSelect={Redirect}>个人中心</MenuItem>
            <MenuItem onSelect={logOut} color="red">退出登录</MenuItem>
          </MenuContent>
        </Menu>
      </Show>
    </HStack >
  );
}

export default Header;