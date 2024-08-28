import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        // 提取 URL 中的 token 參數
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        setToken(token);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await axios.post('http://192.168.50.38:8080/blog/ac/reset-password', new URLSearchParams({
                token,
                newPassword
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setSuccessMessage(response.data);
        } catch (error) {
            setErrorMessage('Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
