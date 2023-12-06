import { useParams } from "@solidjs/router"

export default function Game() {
    const params = useParams(); // params.id

    return (
        <>
            <h1>Game {params.id} to be done.</h1>
        </>
    )
}