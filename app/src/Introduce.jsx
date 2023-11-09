import { createSignal } from 'solid-js';
import styles from './Introduce.module.css';

function Introduce(){
  const [state, setState] = createSignal({});
  return (
    <div className={styles.mod}>
      <div className={styles.body}>
        <div className={styles.group}>
          <span className={styles.hiper}>Hiper</span>
          <span className={styles.introduce}>介绍</span>
          <span className={styles.room}>房间</span>
          <span className={styles.contest}>对局</span>
          <span className={styles.label}>排行榜</span>
          <span className={styles.submit}>提交列表</span>
          <div className={styles.tagWrapperspace}>
            <span className={styles.personalspace}>个人空间</span>
          </div>
          <div className={styles.tagWrapperfound}>
            <span className={styles.foundcontest}>创建比赛</span>
          </div>
        </div>
      </div>
    </div>
 );
}
export default Introduce;