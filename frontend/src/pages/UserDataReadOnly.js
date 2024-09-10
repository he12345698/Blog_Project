import React, { useState, useEffect } from "react";
import UserProfileReadOnly from "../components/UserProfileReadOnly";
import UserAvatarReadOnly from "../components/UserAvatarReadOnly";
import UserArticlesReadOnly from "../components/UserArticlesReadOnly";
import { useParams } from 'react-router-dom';
import styles from "../styles/pages/UserData.module.css"
import { UserContext } from '../components/UserContext';


const UserDataReadOnly = () => {

    const { userId } = useParams(); // 從路由參數中獲取 userId

    return (
        <div className="container mt-2">
            <h1 className="text-center mb-4">Account Name 的小窩</h1>
            <div className="card mx-auto" style={{ maxWidth: '70%' }}>
                <div className="card-body p-1">
                    <main className="mt-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <UserProfileReadOnly userId={userId} />
                            </div>
                            <div className="col-md-6 mb-3 d-flex justify-content-center align-items-center">
                                <UserAvatarReadOnly id={userId} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <UserArticlesReadOnly authorId={userId} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UserDataReadOnly;