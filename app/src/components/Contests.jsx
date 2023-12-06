import { For, createSignal, onMount } from 'solid-js';
import { Link, useNavigate } from "@solidjs/router";
import { Box, Button, Center, Flex, HStack, Heading, SimpleGrid, Spacer, VStack } from "@hope-ui/solid";
import { apiUrl } from "../utils";
import style from "../Contests.module.css";

const Contests = () => {
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

            <Heading as="h2" size="3xl" color="black" ml="20px" mt="$10">
                共有{contestList().length}个比赛
            </Heading>
            <SimpleGrid width="100%" columns={3} id="contestlist" spacing="10px">
                <For each={contestList()}>{(contest) =>
                    <Box class={style.contestBlock} onClick={() => navigateToContest(contest)}>
                        <Box
                            as="img"
                            src={contest.metadata.cover_url}
                            style={`width: 100%; height: 80%; object-fit: cover;`} />
                        <HStack height="20%" margin="10px" display="flex" alignItems="baseline">
                            <Box fontWeight="$semibold" as="h4" fontSize="$2xl" lineHeight="$tight">
                                {contest.metadata.title}
                            </Box>
                        </HStack>
                    </ Box>
                }
                </For>

            </SimpleGrid>
        </ Flex >
    );
};

export default Contests;