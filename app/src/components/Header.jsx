import { Link, useNavigate } from "@solidjs/router";
import { HStack, Heading, Spacer, Box, Button, Image, Anchor, Avatar, Menu, MenuTrigger, MenuItem, MenuContent, createDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@hope-ui/solid";
import logo from '../logo.svg';
import { createSignal, Show } from "solid-js";
import { myself, setMyself } from "../App";
import { apiUrl } from "../utils";

const { isOpen, onOpen, onClose } = createDisclosure()

export default function Header() {
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

  function handleNewGame() {
    fetch(`${apiUrl}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: "{}",
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        navigate(`/game/${data.id}`);
      })
    onClose();
  }

  function logOut() {
    localStorage.removeItem('jwt');
    setMyself(null);
    navigate('/');
  }

  function Redirect() {
    navigate(`/users/${myself().username}`);
  }

  const [bgColor, setBgColor] = createSignal("initialColor");

  const handleMouseEnter = () => {
    setBgColor("#eeeeee");
  };

  const handleMouseLeave = () => {
    setBgColor("initialColor");
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        opened={isOpen()}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader><Heading>是否创建游戏</Heading></ModalHeader>
          <ModalBody>
            这会创建一个默认配置的游戏，你需要对其进行设置
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleNewGame} mr="10px" variant={"solid"}>创建</Button>
            <Button onClick={onClose} variant={"outline"}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <HStack class="header" spacing="10px" borderBottom="1px solid #ccc" boxShadow="0 1px 2px rgba(0, 0, 0, 0.1)">
        <HStack p="$2" spacing="10px" onClick={handleHomepage}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={`background-color: ${bgColor()}; transition: background-color 0.3s ease;`}
        >
          <Image src={logo} alt="logo" width="40px" />
          <Heading class="title" size="xl" fontWeight="$bold" fontStyle={"oblique"}>
            Hiper
          </Heading>
        </HStack>

        <HStack spacing="10px">
          <Button as={Link} href="/games" variant="ghost" color="black" fontSize="$l">游戏</Button>
          <Button as={Link} href="/contests" variant="ghost" color="black" fontSize="$l">比赛</Button>
          {myself() ? myself().permissions.can_create_game_or_contest ?
            <Button onClick={onOpen} variant="ghost" color="black" fontSize="$l">创建游戏</Button> : null : null}
        </HStack>

        <Spacer />
        <Show
          when={myself()}
          fallback={() =>
            <>
              <Button onClick={handleLogin} mr="$1" variant="outline">登录</Button>
              <Button onClick={handleRegister} mr="$4" variant="outline">注册</Button>
            </>}
        >
          <Menu closeOnSelect={true}>
            <Avatar as={MenuTrigger} src={myself().avatar_url} margin="3px" mr="10px" />
            <MenuContent>
              <MenuItem onSelect={Redirect}>个人中心</MenuItem>
              <MenuItem onSelect={logOut} color="red">退出登录</MenuItem>
            </MenuContent>
          </Menu>
        </Show>
      </HStack >
    </>
  );
}