import { Avatar, Input, InputGroup, Textarea, Heading, InputLeftElement, createDisclosure, VStack, HStack, Image, Box, Flex, Accordion, AccordionItem, AccordionButton, AccordionIcon, Text, AccordionPanel, Spacer, Button, Tag, notificationService, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@hope-ui/solid";
import { Link, useNavigate, useParams } from "@solidjs/router";
import { onMount, createSignal, For, Show, createEffect } from "solid-js";
import { Icon } from "@hope-ui/solid";
import { BiRegularGroup, BiRegularMailSend, BiSolidFlag, BiSolidSchool, BiRegularDetail } from "solid-icons/bi";
import { apiUrl } from "../utils";
import { myself } from "../App";

const { isOpen, onOpen, onClose } = createDisclosure()

export default function Users() {
    const params = useParams();

    const [user, setUser] = createSignal();
    const [isMe, setIsMe] = createSignal(false);
    const [newAvatar, setNewAvatar] = createSignal("");

    createEffect(() => {
        if (myself() != null) {
            setIsMe(myself().username === params.username);
        }
    });

    const [nickname, setNickname] = createSignal();
    const [email, setEmail] = createSignal();
    const [name, setName] = createSignal();
    const [school, setSchool] = createSignal();
    const [department, setDepartment] = createSignal();
    const [bio, setBio] = createSignal();

    const navigate = useNavigate();


    onMount(() => {
        fetch(
            `${apiUrl}/users/${params.username}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
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
                setNewAvatar(data.avatar_url);
            })
    });

    function handleEditProfile() {
        fetch(
            `${apiUrl}/user`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    nickname: nickname(),
                    email: email(),
                    name: name(),
                    school: school(),
                    department: department(),
                    bio: bio()
                })
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            }
            )
            .then((data) => {
                notificationService.show({
                    status: "success", /* or success, warning, danger */
                    title: "修改成功！",
                    description: "个人信息已更新！😍",
                });
            }
            )
            .catch((error) => {
                notificationService.show({
                    status: "danger", /* or success, warning, danger */
                    title: "修改失败！",
                    description: "登录信息已过期！😒",
                });
            });
    }

    function handleNewAvatar() {
        fetch(
            `${apiUrl}/user`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    avatar_url: newAvatar()
                })
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            }
            )
            .then((data) => {
                notificationService.show({
                    status: "success", /* or success, warning, danger */
                    title: "修改成功！",
                    description: "头像已更新！😍",
                });
            }
            )
            .catch((error) => {
                notificationService.show({
                    status: "danger", /* or success, warning, danger */
                    title: "修改失败！",
                    description: "登录信息已过期！😒",
                });
            });
    }

    return (
        <Flex flex={1} direction="row">
            <Modal
                closeOnOverlayClick={false}
                opened={isOpen()}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader><Heading>修改头像</Heading></ModalHeader>
                    <ModalBody>
                        请输入头像的链接
                        <Input mt="10px" onInput={(e) => setNewAvatar(e.target.value)} value={newAvatar()} placeholder="头像链接" />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleNewAvatar} mr="10px" variant={"solid"}>创建</Button>
                        <Button onClick={onClose} variant={"outline"}>取消</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Show when={user()} fallback={() => <Heading>用户不存在</Heading>} >
                <VStack width="400px" padding="30px" borderRight="1px solid #ccc" boxShadow="2px 0 4px rgba(0, 0, 0, 0.2)">
                    <Image as={Avatar} boxSize="300px" src={user().avatar_url} />

                    <Input ml="20px" value={user().nickname} disabled={!isMe()} mt="10px" variant="unstyled" fontSize="30px" placeholder="昵称" onInput={(e) => setNickname(e.target.value)} />
                    <Input ml="20px" value={`@${user().username}`} disabled={true} variant="unstyled" color="#777777" fontSize="20px" placeholder="用户名" />
                    <InputGroup mt="20px">
                        <InputLeftElement>
                            <Icon as={BiRegularGroup} />
                        </InputLeftElement>
                        <Input value={user().name} variant="filled" disabled={!isMe()} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="姓名" onInput={(e) => setName(e.target.value)} />
                    </InputGroup>
                    <InputGroup mt="20px">
                        <InputLeftElement>
                            <Icon as={BiRegularMailSend} />
                        </InputLeftElement>
                        <Input value={user().email} variant="filled" disabled={true} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="邮箱" onInput={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                    <HStack>
                        <InputGroup mt="20px" mr="10px">
                            <InputLeftElement>
                                <Icon as={BiSolidSchool} />
                            </InputLeftElement>
                            <Input value={user().school} variant="filled" disabled={!isMe()} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="学校" onInput={(e) => setSchool(e.target.value)} />
                        </InputGroup>
                        <InputGroup mt="20px">
                            <InputLeftElement>
                                <Icon as={BiSolidFlag} />
                            </InputLeftElement>
                            <Input value={user().department} variant="filled" disabled={!isMe()} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="院系" onInput={(e) => setDepartment(e.target.value)} />
                        </InputGroup>
                    </HStack>
                    <InputGroup mt="20px">
                        <Input value={user().bio} variant="filled" disabled={!isMe()} backgroundColor={isMe ? "#eeeeee" : "white"} placeholder="个性签名" onInput={(e) => setBio(e.target.value)} />
                    </InputGroup>
                    <Show when={isMe()} fallback={() => <></>}>
                        <HStack>
                            <Button onClick={handleEditProfile} variant="ghost" mt="20px" color={"#666666"}>更改资料</Button>
                            <Button onClick={onOpen} variant="ghost" mt="20px" color={"#666666"}>更改头像</Button>
                            <Button onClick={() => navigate('/reset_email')} variant="ghost" mt="20px" color={"#666666"}>修改邮箱</Button>
                        </HStack>
                    </Show>
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
                                            <Show when={contest.states.commit_ai_enabled || contest.states.commit_ai_enabled || contest.states.public_match_enabled}
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

                                                <Button as={Link} href={`/ contest / ${contest.id}`} variant="outline" colorScheme="blue" size="sm" mt="10px">
                                                    查看详情
                                                </Button>
                                            </Flex>

                                            <Spacer />
                                            <Image height="160px" margin="20px" src={contest.metadata.cover_url} />
                                        </HStack>
                                    </Box>
                                </AccordionItem>
                            )}
                        </For>
                    </Accordion>
                </Box>
            </Show>

        </Flex >
    )
}
