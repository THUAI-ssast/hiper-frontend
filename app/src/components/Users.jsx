import { Avatar, Input, InputGroup, InputLeftElement, VStack, HStack, Image, Box, Flex, Accordion, AccordionItem, AccordionButton, AccordionIcon, Text, AccordionPanel, Spacer, Button, Tag } from "@hope-ui/solid";
import { Link, useParams } from "@solidjs/router";
import { onMount, createSignal, For, Show } from "solid-js";
import { Icon } from "@hope-ui/solid";
import { BiRegularGroup, BiRegularMailSend, BiSolidFlag, BiSolidSchool, BiRegularDetail } from "solid-icons/bi";
import { apiUrl } from "../utils";

export default function Users() {
    const params = useParams();

    const [isMe, setIsMe] = createSignal(false);
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
        <Flex flex={1} direction="row">
            <VStack width="400px" padding="30px" borderRight="1px solid #ccc" boxShadow="2px 0 4px rgba(0, 0, 0, 0.2)">
                <Image as={Avatar} boxSize="300px" src="https://vip.helloimg.com/images/2023/11/10/odW46g.png" />

                <Input ml="20px" value={user().nickname} disabled={!isMe()} mt="10px" variant="unstyled" fontSize="30px" placeholder="昵称" />
                <Input ml="20px" value={`@${user().username}`} disabled={true} variant="unstyled" color="#777777" fontSize="20px" placeholder="用户名" />
                <InputGroup mt="20px">
                    <InputLeftElement>
                        <Icon as={BiRegularGroup} />
                    </InputLeftElement>
                    <Input value={user().name} variant="filled" disabled={!isMe} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="姓名" />
                </InputGroup>
                <InputGroup mt="20px">
                    <InputLeftElement>
                        <Icon as={BiRegularMailSend} />
                    </InputLeftElement>
                    <Input value={user().email} variant="filled" disabled={!isMe} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="邮箱" />
                </InputGroup>
                <HStack>
                    <InputGroup mt="20px" mr="10px">
                        <InputLeftElement>
                            <Icon as={BiSolidSchool} />
                        </InputLeftElement>
                        <Input value={user().school} variant="filled" disabled={!isMe} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="学校" />
                    </InputGroup>
                    <InputGroup mt="20px">
                        <InputLeftElement>
                            <Icon as={BiSolidFlag} />
                        </InputLeftElement>
                        <Input value={user().department} variant="filled" disabled={!isMe} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="院系" />
                    </InputGroup>
                </HStack>
                {isMe && <Button variant="ghost" mt="20px" color={"#666666"}>更改资料</Button>}
            </VStack >
            <Box flex={1} overflow="auto" overflowY="auto">
                <Text fontSize="30px" fontWeight="$bold" textAlign="start" margin="50px 0 0 50px">
                    已经参加了{(user().contests_registered || []).length}场比赛
                </Text>
                <Accordion margin="50px" borderRadius="10px" boxShadow="1px 1px 8px rgba(0, 0, 0, 0.35)" border="2px gray">
                    <For each={user().contests_registered}>
                        {(contest) => (
                            <AccordionItem border="1px" >
                                <h2>
                                    <AccordionButton height="60px">
                                        <Text flex={1} fontWeight="$bold" fontSize="20px" textAlign="start">
                                            {contest.metadata.title}
                                        </Text>
                                        <Show when={contest.states.commit_ai_enabled}
                                            fallback={
                                                <Tag colorScheme="danger" size="lg">已结束</Tag>
                                            }
                                        >
                                            <Tag colorScheme="success" size="lg">进行中</Tag>
                                        </Show>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <Box as={AccordionPanel} height="200px">
                                    <HStack height="200px" ml="20px">
                                        <Flex direction={"column"} height="150px">
                                            <Text fontWeight="$bold" textAlign="start">
                                                <Icon as={BiRegularGroup} />
                                                {contest.my_privilege}
                                            </Text>

                                            <Text flex={1} fontWeight="$medium">
                                                <Icon as={BiRegularDetail} />
                                                {contest.metadata.readme}
                                            </Text>

                                            <Button as={Link} href={`/matches/${contest.id}`} variant="outline" colorScheme="blue" size="sm" mt="10px">
                                                查看详情
                                            </Button>
                                        </Flex>

                                        <Spacer />
                                        <Image height="160px" margin="20px" src="https://vip.helloimg.com/images/2023/11/10/odW46g.png" />
                                    </HStack>

                                </Box>
                            </AccordionItem>
                        )}
                    </For>
                </Accordion>

            </Box>
        </Flex >
    )
}
