import { For, createSignal, onMount } from 'solid-js';
import { Link, useNavigate } from "@solidjs/router";
import { Box, Button, Center, Flex, HStack, Heading, SimpleGrid, Spacer, VStack } from "@hope-ui/solid";
import { apiUrl } from "../utils";
import style from "../Homepage.module.css";

const Homepage = () => {
    const navigate = useNavigate();

    const navigateToGames = () => {
        navigate('/game');
    };

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
                console.log(user());
            })
    });


    return (
        <Flex flex={1} direction="column" ml="5%" mr="5%" shadow="$2xl" border="1px">
            <Center id="banner" padding={"20px"} height="300px">
                <Heading as="h1" size="6xl" color="black" textAlign="center">欢迎来到Hiper</Heading>
            </Center>
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