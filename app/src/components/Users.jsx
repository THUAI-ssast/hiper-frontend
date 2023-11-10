import { Avatar, Input, InputGroup, InputLeftElement, VStack, HStack, Image, Box, Spacer } from "@hope-ui/solid";
import { useParams } from "@solidjs/router";
import { onMount, createSignal } from "solid-js";
import { Icon } from "@hope-ui/solid";
import { BiRegularAt, BiRegularBusSchool, BiRegularGroup, BiRegularMailSend, BiRegularPhone, BiRegularRename, BiSolidFlag, BiSolidSchool } from "solid-icons/bi";
import { apiUrl } from "../utils";

export default function Users() {
    const params = useParams();

    const [user, setUser] = createSignal({});

    onMount(() => {

        fetch(
            `${apiUrl}/users/${params.username}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
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
                setUser(data);
                console.log(user());
            })
    });

    return (
        <Box bgColor="#dddddd" padding="30px" flexGrow={1} maxW="460px">
            < VStack maxWidth="400px">
                <Image as={Avatar} boxSize="auto" src="https://vip.helloimg.com/images/2023/11/10/odW46g.png" mt="20px" />

                <Input value={user().nickname} mt="10px" variant="unstyled" fontSize="30px" placeholder="昵称" />
                <Input value={`@${user().username}`} variant="unstyled" color="#777777" fontSize="20px" placeholder="用户名" />
                <InputGroup mt="20px">
                    <InputLeftElement>
                        <Icon as={BiRegularGroup} />
                    </InputLeftElement>
                    <Input value={user().name} variant="filled" placeholder="姓名" />
                </InputGroup>
                <InputGroup mt="20px">
                    <InputLeftElement>
                        <Icon as={BiRegularMailSend} />
                    </InputLeftElement>
                    <Input value={user().email} variant="filled" placeholder="邮箱" />
                </InputGroup>
                <HStack>
                    <InputGroup mt="20px" mr="10px">
                        <InputLeftElement>
                            <Icon as={BiSolidSchool} />
                        </InputLeftElement>
                        <Input value={user().school} variant="filled" placeholder="学校" />
                    </InputGroup>
                    <InputGroup mt="20px">
                        <InputLeftElement>
                            <Icon as={BiSolidFlag} />
                        </InputLeftElement>
                        <Input value={user().department} variant="filled" placeholder="院系" />
                    </InputGroup>
                </HStack>
            </VStack >
        </Box>
    )
}
