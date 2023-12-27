import { useParams, useNavigate } from "@solidjs/router"
import { onMount, createSignal, Switch, Match, For, createEffect, Show } from "solid-js";
import { apiUrl } from "../utils";
import { Flex, Heading, Image, Center, HStack, Button, VStack, Box, Table, Thead, Th, Tr, Td, Tbody, Spacer, Tag, Skeleton, notificationService, Select, SelectTrigger, SelectPlaceholder, SelectValue, SelectIcon, SelectContent, SelectListbox, SelectOption, SelectOptionText, SelectOptionIndicator, Input } from "@hope-ui/solid";
import { SolidMarkdown } from "solid-markdown";
import { Pagination } from "@ark-ui/solid";
import { myself } from "../App";

const [game, setGame] = createSignal();
const [sdks, setSdks] = createSignal();


export default function Game() {
    const params = useParams(); // params.id

    const [isAdmin, setIsAdmin] = createSignal(false);
    const [isContestant, setIsContestant] = createSignal(false);

    const navigate = useNavigate();

    const navigateToInfo = () => {
        navigate('/game/' + params.id);
    }

    const navigateToRanklist = () => {
        navigate('/game/' + params.id + '/ranklist');
    }

    const navigateToMatches = () => {
        navigate('/game/' + params.id + '/matches');
    }

    const navigateToSubmissions = () => {
        navigate('/game/' + params.id + '/submissions');
    }

    const navigateToUploadAI = () => {
        navigate('/game/' + params.id + '/upload_ai');
    }

    function createContest() {
        fetch(`${apiUrl}/contests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                "game_id": Number(params.id),
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                notificationService.show({
                    status: "success", /* or success, warning, danger */
                    title: "新建比赛成功！",
                    description: "快去看看吧！😍",
                });
                navigate(`/contest/${data.id}`);
            })
            .catch((error) => {
                notificationService.show({
                    status: "danger", /* or success, warning, danger */
                    title: "新建比赛失败！😢",
                    description: error.message,
                });
            });
    }


    onMount(() => {
        // fetch game data
        fetch(
            `${apiUrl}/games/${params.id}`,
            {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
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
                if (data.my_privilege == "admin") {
                    setIsAdmin(true);
                }
                else if (data.my_privilege == "registered") {
                    setIsContestant(true);
                }
                setGame(data);
            });
        // fetch sdk data
        fetch(
            `${apiUrl}/games/${params.id}/sdks`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
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
                setSdks(data)
            });
    });

    return (
        <>
            <Flex direction="column" width={"100%"}>
                {game() ? (
                    <Image src={game().metadata.cover_url} height="200px" style={`width: 100%; object-fit: cover;`} />
                ) : (
                    <VStack alignItems="stretch" spacing="$2">
                        <Skeleton height="20px" />
                        <Skeleton height="20px" />
                        <Skeleton height="20px" />
                    </VStack>
                )}
                <Center boxShadow={"0 -3px 3px rgba(0, 0, 0, 0.5)"} width={"100%"}>
                    <VStack width="100%">

                        {game() ? (<Heading size="3xl" margin="20px">
                            {game().metadata.title}
                        </Heading>) : (<VStack alignItems="stretch" spacing="$2">
                            <Skeleton height="20px" />
                            <Skeleton height="20px" />
                            <Skeleton height="20px" />
                        </VStack>)}
                        <HStack width="1000px">
                            <Button margin="5px" variant={params.page == null ? "outline" : "ghost"} onClick={navigateToInfo}>详细信息</Button>
                            <Button margin="5px" variant={params.page == "ranklist" ? "outline" : "ghost"} onClick={navigateToRanklist}>排行榜</Button>
                            <Button margin="5px" variant={params.page == "matches" ? "outline" : "ghost"} onClick={navigateToMatches}>对局列表</Button>
                            <Button margin="5px" variant={params.page == "submissions" ? "outline" : "ghost"} onClick={navigateToSubmissions}>提交列表</Button>
                            <Spacer />
                            <Show when={isContestant() || isAdmin()}>
                                <Button margin="5px" variant={params.page == "upload_ai" ? "outline" : "ghost"} onClick={navigateToUploadAI}>上传AI</Button>
                            </Show>
                            <Show when={isAdmin()}>
                                <Button margin="5px" variant={"dashed"} onClick={() => navigate('/admin/game/' + params.id)}>管理</Button>
                            </Show>
                            <Show when={myself()}>
                                <Show when={myself().permissions.can_create_game_or_contest}>
                                    <Button margin="5px" variant={"subtle"} onClick={createContest}>新建比赛</Button>
                                </Show>
                            </Show>
                        </HStack>
                        <Switch fallback={<Heading size={"3xl"}> 404 Not Found </Heading>}>
                            <Match when={params.page == null}>
                                <Infomation />
                            </Match>
                            <Match when={params.page == "ranklist"}>
                                <Ranklist />
                            </Match>
                            <Match when={params.page == "matches"}>
                                <Matches />
                            </Match>
                            <Match when={params.page == "submissions"}>
                                <Submissions />
                            </Match>
                            <Match when={params.page == "upload_ai"}>
                                <UploadAI />
                            </Match>
                        </Switch>
                    </VStack>

                </Center>

            </Flex >
        </>
    );
}

function Infomation() {
    return (
        <Box fontSize="$xl" width={"1000px"}>
            {game() ? (<SolidMarkdown children={game().metadata.readme} />) : (<VStack alignItems="stretch" spacing="$2">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
            </VStack>)}
        </Box >
    );
}

function Ranklist() {
    const params = useParams(); // params.id

    const [ranklist, setRanklist] = createSignal();

    onMount(() => {
        fetch(
            `${apiUrl}/games/${params.id}/contestants`,
            {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
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
                setRanklist(data);
            });
    });

    const [currentPage, setCurrentPage] = createSignal(1);

    const navigate = useNavigate();

    const navigateToUser = (contestant) => {
        navigate('/users/' + contestant.user.username);
    }

    return (
        <>
            {ranklist() ? (
                <Center>
                    <VStack>
                        <Center>
                            <Table highlightOnHover width={"1000px"}>
                                <Thead>
                                    <Th>排名</Th>
                                    <Th>选手</Th>
                                    <Th>主战提交</Th>
                                    <Th>详情</Th>
                                </Thead>
                                <Tbody>
                                    <For each={ranklist().slice((currentPage() - 1) * 5, currentPage() * 5)}>
                                        {(contestant, index) =>
                                            <Tr>
                                                <Td>{(currentPage() - 1) * 5 + index() + 1}</Td>
                                                <Td width={"400px"}>
                                                    <HStack>
                                                        <Box as="img" onClick={() => navigateToUser(contestant)} src={contestant.user.avatar_url} style={`cursor: pointer;width: 30px; height: 30px; border-radius: 50%; object-fit: cover;`} />
                                                        <Box ml="10px">
                                                            <Heading>{contestant.user.nickname}</Heading>
                                                            <Heading fontSize="12px" color="gray">{contestant.user.bio}</Heading>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td>{contestant.assigned_ai.id}</Td>
                                                <Td>{contestant.performance}</Td>
                                            </Tr>
                                        }
                                    </For>
                                </Tbody>
                            </Table>
                        </Center>
                        <Pagination.Root
                            count={ranklist().length}
                            pageSize={5}
                            siblingCount={2}
                            page={currentPage()}
                            onPageChange={(details) => setCurrentPage(details.page)}
                        >
                            {(api) => (
                                <>
                                    <Pagination.PrevTrigger>{"<"}</Pagination.PrevTrigger>
                                    <For each={api().pages}>
                                        {(page, index) =>
                                            page.type === 'page' ? (
                                                <Pagination.Item {...page}>{page.value}</Pagination.Item>
                                            ) : (
                                                <>...</>
                                            )
                                        }
                                    </For>
                                    <Pagination.NextTrigger>{">"}</Pagination.NextTrigger>
                                </>
                            )}
                        </Pagination.Root>
                    </VStack >
                </Center>
            ) : (<VStack alignItems="stretch" spacing="$2">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
            </VStack>)
            }
        </>
    );
}

function Matches() {
    const params = useParams(); // params.id

    const [matchList, setMatchList] = createSignal();
    const [currentPage, setCurrentPage] = createSignal(1);
    const currentPageData = () => matchList().data;

    function updateMatchList() {
        fetch(
            `${apiUrl}/games/${params.id}/matches?limit=${5}&offset=${5 * (currentPage() - 1)}`,
            {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
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
                setMatchList(data);
            });
    }

    onMount(() => {
        updateMatchList();
    });

    const handlePageChange = (details) => {
        setCurrentPage(details.page);
        updateMatchList();
    }

    const navigate = useNavigate();

    const navigateToUser = (username) => {
        navigate('/users/' + username);
    }

    return (
        <>
            {matchList() ? (
                <Center>
                    <VStack>
                        <Center>
                            <Table highlightOnHover width={"1250px"}>
                                <Thead>
                                    <Th width={"100px"}>对局编号</Th>
                                    <Th width={"300px"}>对局时间</Th>
                                    <Th width={"100px"}>备注</Th>
                                    <Th width={"300px"} textAlign={"right"}>选手1</Th>
                                    <Th width={"50px"} />
                                    <Th width={"300px"}>选手2</Th>
                                    <Th width={"100px"}>对局状态</Th>
                                </Thead>
                                <Tbody>
                                    <For each={currentPageData()}>
                                        {(match, index) =>
                                            <Tr>
                                                <Td>
                                                    <Heading>{match.id}</Heading>
                                                </Td>
                                                <Td>
                                                    <Heading>{match.time}</Heading>
                                                </Td>
                                                <Td>
                                                    <Heading>{match.tag}</Heading>
                                                </Td>
                                                <Td width={"400px"}>
                                                    <HStack>
                                                        <Center height={"48px"} width={"48px"} backgroundColor={match.players[0].score > match.players[1].score ? "green" : match.players[0].score < match.players[1].score ? "red" : "gray"}>
                                                            <Heading color="white" >{match.players[0].score}</Heading>
                                                        </Center>
                                                        <Spacer />
                                                        <Box as="img" onClick={() => navigateToUser(match.players[0].user.username)} src={match.players[0].user.avatar_url} style={`cursor: pointer;width: 30px; height: 30px; border-radius: 50%; object-fit: cover;`} />
                                                        <Box ml="10px">
                                                            <Heading>{match.players[0].user.nickname}</Heading>
                                                            <Heading fontSize="12px" color="gray">AI编号: {match.players[0].ai.id}</Heading>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Heading size={"3xl"}>VS.</Heading>
                                                </Td>
                                                <Td width={"400px"}>
                                                    <HStack>
                                                        <Box as="img" onClick={() => navigateToUser(match.players[1].user.username)} src={match.players[1].user.avatar_url} style={`cursor: pointer;width: 30px; height: 30px; border-radius: 50%; object-fit: cover;`} />
                                                        <Box ml="10px">
                                                            <Heading>{match.players[1].user.nickname}</Heading>
                                                            <Heading fontSize="12px" color="gray">AI编号: {match.players[1].ai.id}</Heading>
                                                        </Box>
                                                        <Spacer />
                                                        <Center height={"48px"} width={"48px"} backgroundColor={match.players[1].score > match.players[0].score ? "green" : match.players[1].score < match.players[0].score ? "red" : "gray"}>
                                                            <Heading color="white" >{match.players[1].score}</Heading>
                                                        </Center>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={match.state == "finished" ? "success" : match.state == "pending" || match.state == "running" ? "warning" : "danger"}>{match.state}</Tag>
                                                </Td>
                                            </Tr>
                                        }
                                    </For>
                                </Tbody>
                            </Table>
                        </Center>
                        <Pagination.Root
                            count={matchList().count}
                            pageSize={5}
                            siblingCount={2}
                            page={currentPage()}
                            onPageChange={(details) => handlePageChange(details)}
                        >
                            {(api) => (
                                <>
                                    <Pagination.PrevTrigger>{"<"}</Pagination.PrevTrigger>
                                    <For each={api().pages}>
                                        {(page, index) =>
                                            page.type === 'page' ? (
                                                <Pagination.Item {...page}>{page.value}</Pagination.Item>
                                            ) : (
                                                <> </>
                                            )
                                        }
                                    </For>
                                    <Pagination.NextTrigger>{">"}</Pagination.NextTrigger>
                                </>
                            )}
                        </Pagination.Root>
                    </VStack >
                </Center >
            ) : (<VStack alignItems="stretch" spacing="$2">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
            </VStack>)
            }
        </>
    )
}

function Submissions() {
    const params = useParams(); // params.id

    const [submissionList, setSubmissionList] = createSignal();
    const [currentPage, setCurrentPage] = createSignal(1);

    createEffect(() => {
        if (myself() != null) {
            updateSubmissionList();
        }
    })

    const updateSubmissionList = () => {
        fetch(
            `${apiUrl}/games/${params.id}/ais?limit=${5}&offset=${5 * (currentPage() - 1)}&username=${myself().username}`,
            {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
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
                setSubmissionList(data);
            });
    }

    const downloadAI = (ai) => {
        fetch(
            `${apiUrl}/games/${params.id}/ais/${ai.id}/file`,
            {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                const blob = new Blob([data], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${ai.id}.zip`;
                link.click();
            });
    }

    const handlePageChange = (details) => {
        setCurrentPage(details.page);
        updateSubmissionList();
    }

    const assignAI = (ai) => {
        fetch(
            `${apiUrl}/games/${params.id}/contestant/assigned_ai`,
            {
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
                'body': JSON.stringify({
                    "ai_id": ai.id,
                }),
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((data) => {
                notificationService.show({
                    title: "操作成功",
                    description: "已将AI设为主战！🤩",
                    status: "success",
                    duration: 3000,
                });
            })
            .catch((error) => {
                notificationService.show({
                    title: "操作失败",
                    description: "请重试！😭",
                    status: "danger",
                    duration: 3000,
                });
            });
    }


    return (
        <>
            {submissionList() ? (
                <Center>
                    <VStack>
                        <Center>
                            <Table highlightOnHover width={"1000px"}>
                                <Thead>
                                    <Th>提交序号</Th>
                                    <Th>提交时间</Th>
                                    <Th>语言</Th>
                                    <Th>提交状态</Th>
                                    <Th>下载</Th>
                                </Thead>
                                <Tbody>
                                    <For each={submissionList().data}>
                                        {(submission, index) =>
                                            <Tr>
                                                <Td>{submission.id}</Td>
                                                <Td>{submission.time}</Td>
                                                <Td>{submission.sdk.name}</Td>
                                                <Td>
                                                    <Tag colorScheme={submission.status.state == "finished" ? "success" : submission.status.state == "pending" || submission.status.state == "running" ? "warning" : "danger"}>
                                                        {submission.status.state}
                                                    </Tag>
                                                </Td>
                                                <Td>
                                                    <Button onClick={() => downloadAI(submission)}>下载</Button>
                                                    <Button ml={"10px"} disabled={submission.status.state != "finished"} onClick={() => assignAI(submission)}>设为主战</Button>
                                                </Td>
                                            </Tr>
                                        }
                                    </For>
                                </Tbody>
                            </Table>
                        </Center>
                        <Pagination.Root
                            count={submissionList().count}
                            pageSize={5}
                            siblingCount={2}
                            page={currentPage()}
                            onPageChange={(details) => handlePageChange(details)}
                        >
                            {(api) => (
                                <>
                                    <Pagination.PrevTrigger>{"<"}</Pagination.PrevTrigger>
                                    <For each={api().pages}>
                                        {(page, index) =>
                                            page.type === 'page' ? (
                                                <Pagination.Item {...page}>{page.value}</Pagination.Item>
                                            ) : (
                                                <> </>
                                            )
                                        }
                                    </For>
                                    <Pagination.NextTrigger>{">"}</Pagination.NextTrigger>
                                </>
                            )}
                        </Pagination.Root>
                    </VStack >
                </Center>
            ) : (<VStack alignItems="stretch" spacing="$2">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
            </VStack>)
            }
        </>
    );
}

function UploadAI() {
    const params = useParams(); // params.id

    function handleNewAI() {
        let body = new FormData();
        body.append("note", note());
        for (let i = 0; i < sdks().length; i++) {
            if (sdks()[i].name == selectedSdk()) {
                body.append("sdk_id", String(sdks()[i].id));
            }
        }
        body.append("ai", AI());
        fetch(`${apiUrl}/games/${params.id}/ais`,
            {
                "method": "POST",
                "headers": {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
                "body": body,
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
                    title: "操作成功",
                    description: "AI上传成功！🤩",
                    status: "success",
                    duration: 3000,
                });
            })
            .catch((error) => {
                notificationService.show({
                    title: "操作失败",
                    description: "请重试！😭",
                    status: "danger",
                    duration: 3000,
                });
            });
    }

    const [note, setNote] = createSignal("");
    const [selectedSdk, setSelectedSdk] = createSignal("请选择SDK");
    const [AI, setAI] = createSignal();

    return (
        <Show when={sdks()}>
            <VStack gap={"20px"}>
                <Select value={selectedSdk()} onChange={setSelectedSdk}>
                    <SelectTrigger>
                        <SelectPlaceholder>选择SDK</SelectPlaceholder>
                        <SelectValue />
                        <SelectIcon />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectListbox>
                            <For each={sdks()}>
                                {sdk => (
                                    <SelectOption value={sdk.name}>
                                        <SelectOptionText>{sdk.name}</SelectOptionText>
                                        <SelectOptionIndicator />
                                    </SelectOption>
                                )}
                            </For>
                        </SelectListbox>
                    </SelectContent>
                </Select>
                <Input placeholder="AI文件" type="file" onInput={(e) => setAI(e.target.files[0])} accept=".zip" />
                <Input placeholder="备注" onInput={(e) => setNote(e.target.value)} />
                <Button onClick={handleNewAI} disabled={!AI() || selectedSdk() == "请选择SDK"}>上传</Button>
            </VStack>
        </Show>
    );
}