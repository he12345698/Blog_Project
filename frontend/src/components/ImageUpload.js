import React, { useState } from 'react';

function ImageUpload({id}) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('請選擇一張圖片！');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`http://localhost:8080/blog/api/userProfile/upload-image/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('圖片已成功上傳: ');
            } else {
                alert('圖片上傳失敗！');
            }
        } catch (error) {
            console.error('上傳圖片時發生錯誤: ', error);
            alert('上傳圖片時發生錯誤！');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>上傳圖片</button>
        </div>
    );
}

export default ImageUpload;
