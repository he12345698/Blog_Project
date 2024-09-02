import React, { useState, useEffect } from "react";

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // 前端驗證
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('新密碼與確認密碼不符');
            return;
        }

        if (newPassword < 8) {
            setErrorMessage('密碼必須至少8個字符長');
            return;
        }

        if (password != currentPassword) {
            setErrorMessage('您輸入的密碼與當前密碼不符');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:8080/blog/api/userProfile/update-password/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                }),
            });

            if (response.ok) {
                console.log("Current Password:", currentPassword);
                console.log("New Password:", newPassword);
                setSuccessMessage('密碼更新成功');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
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

    // 獲取後端資料
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            // console.log('Request Headers:', {
            //   'Authorization': `Bearer ${token}` 
            // });
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/blog/api/protected-endpoint', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('data:', data);
                        console.log('id:' + data.id);
                        console.log('password' + data.password);
                        setUserId(data.id || null);
                        setPassword(data.password || null);
                    } else {
                        console.log('Response error:', response);
                        //setUsername('訪客2');
                        //setUserImage('/Image/default-avatar.jpg'); // 默认头像
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

        };

        fetchUserInfo();
    }, []);


    return (
        <div>
            <h1>修改密碼</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentPassword">當前密碼：</label>
                    <input
                        type="text"
                        id="currentPassword"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="請再次輸入當前密碼"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">新密碼：</label>
                    <input
                        type="text"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="請輸入新密碼"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">確認密碼：</label>
                    <input
                        type="text"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="請再次輸入新密碼"
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '提交中...' : '修改密碼'}
                </button>
                {errorMessage && <p style={{ color: 'red', fontWeight: "bold" }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green', fontWeight: "bold" }}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default ChangePassword;