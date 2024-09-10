import React, { useState, useEffect, useContext } from "react";
import UserProfile from "../components/UserProfile";
import UserAvatar from "../components/UserAvatar";
import UserArticles from "../components/UserArticles";
import styles from "../styles/pages/UserData.module.css"
import { UserContext } from '../components/UserContext';


const UserData = () => {

    const { user } = useContext(UserContext); // 取得 setUser 方法

    return (
        <div className="container mt-2">
            <h1 className="text-center mb-4">{user?.username} 的小窩</h1>
            <div className="card mx-auto" style={{ maxWidth: '70%' }}>
                <div className="card-body p-1">
                    <main className="mt-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <UserProfile userId={user?.id} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex justify-content-center align-items-center">
                                <UserAvatar id={user?.id} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <UserArticles authorId={user?.id} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserData;