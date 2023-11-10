import { Avatar, Input, InputGroup, InputLeftElement, VStack } from "@hope-ui/solid";
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
        < VStack maxWidth="300px" ml="20px">
            <Avatar size="2xl" url={user().avatar_url} mt="20px" />

            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiRegularAt} />
                </InputLeftElement>
                <Input value={user().username} variant="filled" />
            </InputGroup>
            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiRegularRename} />
                </InputLeftElement>
                <Input value={user().nickname} variant="filled" />
            </InputGroup>
            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiRegularGroup} />
                </InputLeftElement>
                <Input value={user().name} variant="filled" />
            </InputGroup>
            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiRegularMailSend} />
                </InputLeftElement>
                <Input value={user().email} variant="filled" />
            </InputGroup>
            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiSolidSchool} />
                </InputLeftElement>
                <Input value={user().school} variant="filled" />
            </InputGroup>
            <InputGroup mt="20px">
                <InputLeftElement>
                    <Icon as={BiSolidFlag} />
                </InputLeftElement>
                <Input value={user().department} variant="filled" />
            </InputGroup>
        </VStack >
    )
}
