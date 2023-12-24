import { For, createSignal, onMount } from 'solid-js';
import { Link, useNavigate } from "@solidjs/router";
import { Box, Button, Center, Flex, HStack, Heading, SimpleGrid, Spacer, VStack } from "@hope-ui/solid";
import { apiUrl } from "../utils";
import style from "../Homepage.module.css";

const Homepage = () => {
    const navigate = useNavigate();

    const [contestList, setContestList] = createSignal([
    ]);

    const navigateToContest = (contest) => {
        navigate(`/contest/${contest.id}`);
    }

    onMount(() => {
        fetch(
            `${apiUrl}/contests`,
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
                setContestList(data);
            })
    });


    return (
        <Flex flex={1} direction="column" ml="5%" mr="5%">
            <Center id="banner" padding={"20px"} height="300px">
                <VStack>
                    <Heading as="h1" size="6xl" color="black" textAlign="center">欢迎来到Hiper</Heading>
                    <Heading as="h2" size="2xl" color="black" textAlign="center" mt="30px">一个专注于AI编程竞赛的平台</Heading>
                </VStack>
            </Center>
            <Heading as="h2" size="2xl" color="black" ml="20px">
                在这里你能参加
            </Heading>
            <SimpleGrid width="100%" columns={2} id="contestlist" spacing="10px">
                <For each={contestList()}>{(contest) => <Box class={style.contestBlock} onClick={() => navigateToContest(contest)}>
                    <Box
                        as="img"
                        src={contest.metadata.cover_url}
                        style={`width: 100%; height: 80%; object-fit: cover;`} />
                    <Box padding="$4">
                        <Box display="flex" alignItems="baseline">
                            <Box mt="$1" fontWeight="$semibold" as="h4" fontSize="$2xl" lineHeight="$tight">
                                {contest.metadata.title}
                            </Box>
                        </Box>
                    </Box>
                </ Box>
                }
                </For>
            </SimpleGrid>
        </ Flex >
    );
};

export default Homepage;