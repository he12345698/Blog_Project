import React, { useState, useEffect } from 'react';
import ImageCropper from './ImageCropper';
import styles from "../styles/components/UserAvatar.module.css";

function ImageUpload({ id }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null); 
    const [cropperSrc, setCropperSrc] = useState(null); // 用於存儲 Cropper 的圖片來源

    const handleFileChange = (event) => {
        const newFile = event.target.files[0];

        // 檢查新選擇的文件是否與當前選擇的文件不同
        if (!newFile || (selectedFile && newFile.name === selectedFile.name && newFile.size === selectedFile.size)) {
            return; // 如果是同一個文件，則不更新狀態
        }

        setSelectedFile(newFile); // 更新為新選擇的文件
        setCropperSrc(URL.createObjectURL(newFile)); // 設置新的 Cropper 圖片來源
    };

    const handleCrop = (croppedBlob) => {
        setCroppedImage(croppedBlob); 
    };

    const handleUpload = async () => {
        if (!croppedImage) {
            alert('請先選擇並裁剪一張圖片！');
            return;
        }

        const formData = new FormData();
        formData.append('file', croppedImage, '.jpg'); 

        try {
            const response = await fetch(`http://localhost:8080/blog/api/userProfile/upload-image/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('圖片已成功上傳');
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
            {/* 只有當 cropperSrc 有值時才渲染 ImageCropper 組件 */}
            {cropperSrc && <ImageCropper src={cropperSrc} onCrop={handleCrop} />}
        </div>
    );
}

export default ImageUpload;
