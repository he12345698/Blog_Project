import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function EmailVerificationPage() {
    const location = useLocation();
    const [message, setMessage] = useState("正在验证您的电子邮件...");

    useEffect(() => {
        // 从 URL 中获取验证 token
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        console.log(token)

        // 向后端发送请求进行验证
        fetch(`http://localhost:8080/blog/ac/verify-email?token=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    setMessage(data.message);
                } else {
                    setMessage(data.message);
                }
            })
            .catch(error => {
                setMessage("验证失败，请稍后再试。");
            });
    }, [location.search]);

    return (
        <div className="email-verification-container">
            <h2>{message}</h2>
        </div>
    );
}

export default EmailVerificationPage;
