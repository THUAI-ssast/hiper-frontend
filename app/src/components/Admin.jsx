import { Center, FormControl, VStack, FormLabel, Switch, Input, Divider, HStack, Box, Button, Tabs, TabList, Tab, TabPanel, Heading, Flex, Skeleton, Image, Grid, GridItem } from "@hope-ui/solid";
import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { apiUrl } from "../utils";
import { useParams } from "@solidjs/router";
import { object, string } from "yup";
import { MonacoEditor } from "solid-monaco";
import { SolidMarkdown } from "solid-markdown";
import { MDXProvider } from "solid-marked";
import { marked } from "marked";


export default function Admin() {
    const params = useParams();

    const [metadata, setMetadata] = createSignal();
    const [sdks, setSdks] = createSignal();
    const [editingSdks, setEditingSdks] = createSignal();
    const [newSdk, setNewSdk] = createSignal({
        "name": "新建SDK",
        "readme": "",
        "build_ai_dockerfile": "",
        "run_ai_dockerfile": ""
    });
    const [states, setStates] = createSignal();

    const [loaded, setLoaded] = createSignal(false);

    onMount(() => {
        fetch(
            `${apiUrl}/games/${params.id}`,
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
                setMetadata(data.metadata);
                setStates(data.base_contest.states);
            });

        fetch(
            `${apiUrl}/games/${params.id}/sdks`,
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
                setSdks(data);
                setEditingSdks(data);

                if (editingSdks()) {
                    for (let i = 0; i < editingSdks().length; i++) {
                        getFullSdk(i);
                    }
                }

                setLoaded(true);
            });

    });

    function getFullSdk(index) {
        fetch(
            `${apiUrl}/games/${params.id}/sdks/${sdks()[index].id}`,
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
                let cpyEditingSdk = editingSdks();
                cpyEditingSdk[index].build_ai_dockerfile = data.build_ai.dockerfile;
                cpyEditingSdk[index].run_ai_dockerfile = data.run_ai.dockerfile;
                setEditingSdks(cpyEditingSdk);
                console.log(cpyEditingSdk[index]);
            });
    }

    function handleEditMetadata() {
        fetch(
            `${apiUrl}/games/${params.id}/metadata`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(metadata())
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
                console.log("修改成功！");
            });
        fetch(
            `${apiUrl}/games/${params.id}/states`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(states())
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
                console.log("修改成功！");
            });
    }

    function handleEditSdks(index) {
        let body = {}
        body.name = editingSdks()[index].name;
        body.readme = editingSdks()[index].readme;
        body.build_ai_dockerfile = editingSdks()[index].build_ai_dockerfile;
        body.run_ai_dockerfile = editingSdks()[index].run_ai_dockerfile;
        if (editingSdks()[index].sdk) {
            body.sdk = editingSdks()[index].sdk;
        }
        console.log(body);

        fetch(
            `${apiUrl}/games/${params.id}/sdks/${sdks()[index].id}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: body
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
                console.log("修改成功！");
            });
    }


    function handleNewSdk() {
        let body = {}
        body.name = newSdk().name;
        body.readme = newSdk().readme;
        body.build_ai_dockerfile = newSdk().build_ai_dockerfile;
        body.run_ai_dockerfile = newSdk().run_ai_dockerfile;
        if (newSdk().sdk) {
            body.sdk = newSdk().sdk;
        }
        else {
            console.log("sdk文件为空!");
            return;
        }

        console.log(body);

        fetch(
            `${apiUrl}/games/${params.id}/sdks`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: body
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
                console.log("修改成功！");
            });
    }
    return (
        <Tabs variant="cards" flex={1}>
            <TabList>
                <Tab>基本信息</Tab>
                <Tab>SDK</Tab>
            </TabList>
            <TabPanel height={"95%"}>
                <Show when={metadata() && states()}>
                    <Flex direction="row" height={"99%"} >
                        <Flex direction="column" ml="5%" mr="15px" width={"40%"} height={"100%"}>
                            <FormControl mb="10px">
                                <FormLabel>游戏名称</FormLabel>
                                <Input value={metadata().title} onInput={(e) => setMetadata({ ...metadata(), title: e.target.value })} />
                            </ FormControl>
                            <FormControl mb="10px">
                                <FormLabel>封面链接</FormLabel>
                                <Input value={metadata().cover_url} onInput={(e) => setMetadata({ ...metadata(), cover_url: e.target.value })} />
                            </ FormControl>
                            <FormLabel>属性设置</FormLabel>
                            <Grid templateColumns="repeat(3, 2fr)" gap={6}>
                                <GridItem>
                                    <Switch checked={states().contest_script_environment_enabled} onChange={(e) => setStates({ ...states(), contest_script_environment_enabled: e.target.checked })}>启用赛事脚本</Switch>
                                </GridItem>
                                <GridItem>
                                    <Switch checked={states().commit_ai_enabled} onChange={(e) => setStates({ ...states(), commit_ai_enabled: e.target.checked })}>允许提交AI</Switch>
                                </GridItem>
                                <GridItem>
                                    <Switch checked={states().assign_ai_enabled} onChange={(e) => setStates({ ...states(), assign_ai_enabled: e.target.checked })}>允许测评AI</Switch>
                                </GridItem>
                                <GridItem>
                                    <Switch checked={states().private_match_enabled} onChange={(e) => setStates({ ...states(), private_match_enabled: e.target.checked })}>允许私人对局</Switch>
                                </GridItem>
                                <GridItem>
                                    <Switch checked={states().public_match_enabled} onChange={(e) => setStates({ ...states(), public_match_enabled: e.target.checked })}>允许公开对局</Switch>
                                </GridItem>
                                <GridItem>
                                    <Switch checked={states().test_match_enabled} onChange={(e) => setStates({ ...states(), test_match_enabled: e.target.checked })}>允许测试对局</Switch>
                                </GridItem>
                            </Grid>
                            <FormControl mb="10px" flex={1}>
                                <FormLabel>详情介绍</FormLabel>
                                <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                    <MonacoEditor language="markdown" value={metadata().readme} onChange={(string, event) => setMetadata({ ...metadata(), readme: string })} />
                                </Box>
                            </ FormControl>
                            <Button onClick={handleEditMetadata}>修改</Button>
                        </Flex>
                        <Divider orientation="vertical" />
                        <Box flex={1} margin="20px" borderWidth="1px" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                            <Image src={metadata().cover_url} height="200px" style={`width: 100%; object-fit: cover;`}
                                onError={(e) => { e.target.src = "http://dummyimage.com/250x250" }}
                            />
                            <div innerHTML={marked(metadata().readme)} style="maxWidth: 100%;overflow: auto;box-sizing: border-box;padding: 0 20px;padding: 40px;"></div>
                        </Box >
                    </Flex>
                </Show>
            </TabPanel>
            <TabPanel height={"1000px"}>
                <Show when={loaded()}>
                    <Flex direction="row" height={"1000px"}>
                        <Tabs variant="cards" width="50%" height={"950px"}>
                            <TabList>
                                <For each={sdks()}>
                                    {(sdk) => <Tab>{sdk.name}</Tab>}
                                </For>
                            </TabList>
                            <For each={sdks()}>
                                {(sdk, index) => <TabPanel height={"100%"}>
                                    <Flex direction="column" ml="5%" mr="15px" height={"100%"}>
                                        <FormControl mb="10px">
                                            <FormLabel>SDK名称</FormLabel>
                                            <Input value={editingSdks()[index()].name} onInput={(e) => { setEditingSdks(editingSdks().map((s, i) => i === index() ? { ...s, name: e.target.value } : s)) }} />
                                        </ FormControl>
                                        <FormControl mb="10px">
                                            <FormLabel>SDK文件</FormLabel>
                                            <Input id="edit_sdk_file" type="file" onInput={(e) => { setEditingSdks(editingSdks().map((s, i) => i === index() ? { ...s, sdk: e.target.files[0] } : s)) }} />
                                        </ FormControl>
                                        <FormControl mb="20px" height={"200px"}>
                                            <FormLabel>SDK描述</FormLabel>
                                            <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                                <MonacoEditor language="markdown" value={editingSdks()[index()].readme} onChange={(string, event) => { setEditingSdks(editingSdks().map((s, i) => i === index() ? { ...s, readme: string } : s)) }} />
                                            </Box>
                                        </ FormControl>
                                        <FormControl mb="20px" height={"200px"}>
                                            <FormLabel>构建Dockerfile</FormLabel>
                                            <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                                <MonacoEditor language="markdown" value={editingSdks()[index()].build_ai_dockerfile} onChange={(string, event) => { setEditingSdks(editingSdks().map((s, i) => i === index() ? { ...s, build_ai_dockerfile: string } : s)) }} />
                                            </Box>
                                        </ FormControl>
                                        <FormControl mb="20px" height={"200px"}>
                                            <FormLabel>运行Dockerfile</FormLabel>
                                            <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                                <MonacoEditor language="markdown" value={editingSdks()[index()].run_ai_dockerfile} onChange={(string, event) => { setEditingSdks(editingSdks().map((s, i) => i === index() ? { ...s, run_ai_dockerfile: string } : s)) }} />
                                            </Box>
                                        </ FormControl>
                                        <Button height="40px" onClick={() => handleEditSdks(index())}>修改SDK</Button>
                                    </Flex>
                                </TabPanel>}
                            </For>
                        </Tabs>
                        <Divider orientation="vertical" />
                        <Flex flex={1} direction="column" ml="5%" mr="15px" height={"100%"}>
                            <Heading size={"xl"}>新建SDK</Heading>
                            <FormControl mb="10px" required>
                                <FormLabel>SDK名称</FormLabel>
                                <Input onInput={(e) => { setNewSdk({ ...newSdk(), name: e.target.value }) }} />
                            </ FormControl>
                            <FormControl mb="10px" required>
                                <FormLabel>SDK文件</FormLabel>
                                <Input id="new_sdk_file" type="file" onInput={(e) => setNewSdk({ ...newSdk(), sdk: e.target.files[0] })} />
                            </ FormControl>
                            <FormControl mb="20px" height={"200px"} required>
                                <FormLabel>SDK描述</FormLabel>
                                <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                    <MonacoEditor language="markdown" onChange={(e) => { setNewSdk({ ...newSdk(), readme: e }) }} />
                                </Box>
                            </ FormControl>
                            <FormControl mb="20px" height={"200px"} required>
                                <FormLabel>构建Dockerfile</FormLabel>
                                <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                    <MonacoEditor language="markdown" onChange={(e) => { setNewSdk({ ...newSdk(), build_ai_dockerfile: e }) }} />
                                </Box>
                            </ FormControl>
                            <FormControl mb="20px" height={"200px"} required>
                                <FormLabel>运行Dockerfile</FormLabel>
                                <Box borderWidth="1px" padding="3px" height="95%" borderColor="rgba(0, 0, 0, 0.2)" borderRadius="5px">
                                    <MonacoEditor language="markdown" onChange={(e) => { setNewSdk({ ...newSdk(), run_ai_dockerfile: e }) }} />
                                </Box>
                            </ FormControl>
                            <Button onClick={handleNewSdk}>新建SDK</Button>
                        </Flex>
                    </Flex>
                </Show>
            </TabPanel>
        </Tabs>
    )
}