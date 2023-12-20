import { For, createSignal, onMount } from 'solid-js';
import { useNavigate } from "@solidjs/router";
import { Box, Flex, HStack, Heading, SimpleGrid } from "@hope-ui/solid";
import { apiUrl } from "../utils";
import style from "../Games.module.css";

const Games = () => {
    const navigate = useNavigate();

    const [gameList, setgameList] = createSignal([
    ]);

    const navigateTogame = (game) => {
        navigate(`/game/${game.id}`);
    }

    onMount(() => {
        fetch(
            `${apiUrl}/games`,
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
                setgameList(data);
            })
    });


    return (
        <Flex flex={1} direction="column" ml="5%" mr="5%">

            <Heading as="h2" size="3xl" color="black" ml="20px" mt="$10">
                {gameList().length}种游戏任你选
            </Heading>
            <SimpleGrid width="100%" columns={3} id="gamelist" spacing="10px">
                <For each={gameList()}>{(game) =>
                    <Box class={style.gameBlock} onClick={() => navigateTogame(game)}>
                        <Box
                            as="img"
                            src={game.metadata.cover_url}
                            style={`width: 100%; height: 80%; object-fit: cover;`} />
                        <HStack height="20%" margin="10px" display="flex" alignItems="baseline">
                            <Box fontWeight="$semibold" as="h4" fontSize="$2xl" lineHeight="$tight">
                                {game.metadata.title}
                            </Box>
                        </HStack>
                    </ Box>
                }
                </For>

            </SimpleGrid>
        </ Flex >
    );
};

export default Games;