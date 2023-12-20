import { useParams, useNavigate, Routes, Route, Link } from "@solidjs/router"
import { onMount, createSignal, Switch, Match, For } from "solid-js";
import { apiUrl } from "../utils";
import { Flex, Heading, Image, Center, HStack, Button, VStack, Box, Table, Thead, Th, Tr, Td, Tbody, Spacer, Tag } from "@hope-ui/solid";
import { SolidMarkdown } from "solid-markdown";
import { Pagination } from "@ark-ui/solid";

const [game, setGame] = createSignal();

export default function Game() {
    const params = useParams(); // params.id

    const [isAdmin, setIsAdmin] = createSignal(false);

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
                setGame(data);
            });
    });

    return (
        <>
            <Flex direction="column" width={"100%"}>
                {game() ? (
                    <Image src={game().metadata.cover_url} height="200px" style={`width: 100%; object-fit: cover;`} />
                ) : (
                    <div>加载中...</div>
                )}
                <Center boxShadow={"0 -3px 3px rgba(0, 0, 0, 0.5)"} width={"100%"}>
                    <VStack width="100%">

                        {game() ? (<Heading size="3xl" margin="20px">
                            {game().metadata.title}
                        </Heading>) : (<div>加载中...</div>)}
                        <HStack>
                            <Button margin="5px" variant={params.page == null ? "outline" : "ghost"} onClick={navigateToInfo}>详细信息</Button>
                            <Button margin="5px" variant={params.page == "ranklist" ? "outline" : "ghost"} onClick={navigateToRanklist}>排行榜</Button>
                            <Button margin="5px" variant={params.page == "matches" ? "outline" : "ghost"} onClick={navigateToMatches}>对局列表</Button>
                            <Button margin="5px" variant={params.page == "submissions" ? "outline" : "ghost"} onClick={navigateToSubmissions}>提交列表</Button>
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
            {game() ? (<SolidMarkdown children={game().metadata.readme} />) : (<div>加载中...</div>)}
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
            ) : (<div>加载中...</div >)
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
                console.log(data);
            });
    }

    onMount(() => {
        updateMatchList();
    });

    const handlePageChange = (details) => {
        setCurrentPage(details.page);
        console.log(details.page);
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
            ) : (<div>加载中...</div >)
            }
        </>
    )
}

function Submissions() {
    const params = useParams(); // params.id

    const [submissionList, setSubmissionList] = createSignal();
    const [currentPage, setCurrentPage] = createSignal(1);
    const [myself, setMyself] = createSignal();

    onMount(() => {
        if (localStorage.getItem('jwt')) {
            fetch(`${apiUrl}/user`, {
                method: 'GET',
                headers: {
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
                    setMyself(data);
                })
        }

        updateSubmissionList();
    });

    const updateSubmissionList = () => {
        fetch(
            `${apiUrl}/games/${params.id}/ais?limit=${5}&offset=${5 * (currentPage() - 1)}&username=${myself.username}`,
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
        console.log(ai);
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
            ) : (<div>加载中...</div >)
            }
        </>
    );
}