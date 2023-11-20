import { createEffect, createSignal, Show, onMount } from "solid-js";
import { Input, Button, Center, VStack, Spacer, HStack, Anchor } from "@hope-ui/solid";
import { FormControl, FormLabel, FormHelperText, FormErrorMessage } from "@hope-ui/solid";
import { Link, useNavigate } from "@solidjs/router";
import { setLoggedIn, loggedIn } from "./Header";
import { apiUrl, checkLoggedIn } from "../utils";
import { For } from 'solid-js';
import styles from '../Game.module.css';

const games = [
    {
      id: 1,
      title: '太空Geek兔',
      handle: 'geek-rabbit',
      date: '2023-7-16',
      imageUrl: 'path/to/space-game-image.jpg',
      createdBy: 'admin'
    },
    {
      id: 2,
      title: 'ANTWar',
      handle: 'antwar',
      date: '2023-3-30',
      imageUrl: 'path/to/antwar-game-image.jpg',
      createdBy: 'admin'
    },
    // some examples
  ];

const Game = () => {
  return (
    <div class={styles.gamesPage}>
      <header class={styles.gamesHeader}>
        <h1 class={styles.gamesListTitle}>游戏列表</h1>
        <button class={styles.createGameButton}>
          <span class={styles.plusIcon}>+</span>
          创建游戏
        </button>
      </header>
      <div class={styles.gameContainer}>
        <For each={games}>{(game) =>
          <div class={styles.gameCard}>
            <img src={game.imageUrl} alt={game.title} class={styles.gameImage} />
            <div class={styles.gameContent}>
              <h2 class={styles.gameTitle}>{game.title} ({game.handle})</h2>
              <p class={styles.gameMeta}>Created in {game.date} by {game.createdBy}</p>
              <button class={styles.gameButton}>游戏详情</button>
            </div>
          </div>
        }</For>
      </div>
    </div>
  );
};

export default Game;