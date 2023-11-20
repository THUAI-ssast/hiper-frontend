import { createSignal } from 'solid-js';
import { useNavigate } from "@solidjs/router";
import styles from '../Homepage.module.css';

const Homepage = () => {
  const navigate = useNavigate();

  const navigateToGames = () => {
    navigate('/game');
  };

  return (
    <div class={styles.homepage}>
      <main class={styles.main}>
        <section class={styles.banner}>
          <h1>Hiper-专业AI编程竞赛平台</h1>
          <p>Hiper平台是一个实用第一，简明第二的，支持自定义赛事设定的赛事平台，由清华大学软件学院开发，希望让竞赛举办方和参赛选手有着更好的体验。</p>
          <div class={styles.bannerActions}>
            <button class={styles.joinButton} onClick={navigateToGames}>加入比赛</button>
            <button class={styles.createButton} onClick={navigateToGames}>创建比赛</button>
          </div>
        </section>
        <section class={styles.search}>
          <input type="text" placeholder="请输入关键词" class={styles.searchInput} />
          <button class={styles.searchButton}>搜索</button>
        </section>
        <section class={styles.competitions}>
          <article class={styles.competitionItem}>
            <h2>赛事内容1</h2>
            <p>赛事内容描述1</p>
          </article>
          <article class={styles.competitionItem}>
            <h2>赛事内容2</h2>
            <p>赛事内容描述2</p>
          </article>
        </section>
      </main>
      <footer class={styles.footer}>
        <div class={styles.footerContent}>
          <a href="#">关于我们</a>
          <a href="#">联系我们</a>
          <a href="#">合作伙伴</a>
          <a href="#">赞助</a>
          <a href="#">隐私政策</a>
          <a href="#">使用条款</a>
          <div class={styles.socialMedia}>
            <a href="#">微博</a>
            <a href="#">微信公众号</a>
            <a href="#">QQ群</a>
            <a href="#">GitHub</a>
            <a href="#">论坛</a>
          </div>
        </div>
        <div class={styles.footerBottom}>
          <p>©2023 产品版权所有。保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;