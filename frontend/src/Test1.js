import React, { useEffect } from 'react';

const Test1 = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchHello = async () => {
            const response = await fetch('http://localhost:8080/blog/api/hello');
            const data = await response.text(); // 使用 text() 获取字符串响应
            console.log(data); // 应该会在控制台打印 "Hello, World!"
        };

        fetchHello();
    }, []);

    return <div>Check the console for the message!</div>;
};

export default Test1;
