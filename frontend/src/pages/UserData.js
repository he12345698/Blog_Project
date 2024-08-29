import React from "react";
import UserProfile from "../components/UserProfile";
import UserAvatar from "../components/UserAvatar";
import UserArticles from "../components/UserArticles";
import styles from "../styles/pages/UserData.module.css"
import ImageUpload from "../components/ImageUpload";

const articles = [
    { title: '文章標題 1', url: 'article1-url', description: '文章摘要或簡短描述 1' },
    { title: '文章標題 2', url: 'article2-url', description: '文章摘要或簡短描述 2' },
    { title: '文章標題 3', url: 'article3-url', description: '文章摘要或簡短描述 3' },
];


const UserData = () => {

    return (
        <div class={styles.wrapper}>
            <ImageUpload id={7}/>
            <h1>Account Name的小窩</h1>
            <main class={styles.profile_wrapper}>
                <div className={styles.profile_container}>
                    <div className={styles.grid_container}>
                        <div className={styles.profile}>
                        {/* <UserProfile userId={4}/> */}
                        </div>
                        <div className={styles.avatar}>
                        <UserAvatar userId={7}/>
                        </div>
                        <div className={styles.full_width}>
                            {/* <UserArticles articles={articles} /> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserData;