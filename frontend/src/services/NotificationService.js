export const fetchUnreadNotifications = async (userId) => {
    //const response = await fetch(`http://niceblog.myvnc.com:8080/blog/notifications/unread/${userId}`);
    const response = await fetch(`http://niceblog.myvnc.com:8080/blog/notifications/unread/${userId}`);
    
    if (!response.ok) {
        throw new Error('网络错误');
    }
    return response.json();
};


