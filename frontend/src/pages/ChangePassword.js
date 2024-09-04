import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "../styles/pages/ChangePassword.module.css";
import { UserContext } from '../components/UserContext';

const ChangePassword = () => {

    const { user } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState('');
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // 前端驗證
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('新密碼與確認密碼不符');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage('密碼必須至少8個字符長');
            return;
        }

        if (currentPassword !== user?.password) {
            setErrorMessage("與當前密碼不符");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:8080/blog/api/userProfile/update-password/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                }),
            });

            if (response.ok) {
                // console.log("Current Password:", currentPassword);
                // console.log("New Password:", newPassword);
                setSuccessMessage('密碼更新成功');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                navigate('/UserData'); // 跳轉到用戶資料頁面
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "密碼更新失敗");
            }
        } catch (error) {
            setErrorMessage('無法連接到伺服器，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container-fluid">
            <h1 className={`text-center mt-4 mb-4 ${styles.h1}`}>修改密碼</h1>
            <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <div className={`card p-4 shadow-sm ${styles.card}`}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className={`${styles.label} form-label`}>當前密碼：</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="請再次輸入當前密碼"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className={`${styles.label} form-label`}>新密碼：</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="請輸入新密碼"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmNewPassword" className={`${styles.label} form-label`}>確認密碼：</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="請再次輸入新密碼"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-primary w-100 ${styles.button}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '提交中...' : '修改密碼'}
                            </button>
                            {errorMessage && <p className="text-danger fw-bold mt-3">{errorMessage}</p>}
                            {successMessage && <p className="text-success fw-bold mt-3">{successMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;