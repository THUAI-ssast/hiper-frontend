import { A, Link, useNavigate } from "@solidjs/router";
import { HStack, Heading, Spacer, Box, Button, Image, Anchor } from "@hope-ui/solid";
import logo from '../logo.svg';

function Header() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleRegister() {
    navigate('/register');
  }

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

      <Spacer />

      <Box>
        <Button onClick={handleLogin} mr="$4" variant="outline">登录</Button>
        <Button onClick={handleRegister} mr="$4" variant="outline">注册</Button>
      </Box>
    </HStack>
  );
}

export default Header;