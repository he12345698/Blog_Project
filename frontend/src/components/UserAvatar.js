import React, { useState } from 'react';
import styles from "../styles/components/UserAvatar.module.css";
import Modal from 'react-modal';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const UserAvatar = ({ userId }) => {
    const [avatar, setAvatar] = useState({
        imagelink: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crop, setCrop] = useState({ aspect: 1 });
    const [croppedImage, setCroppedImage] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [maxWidth, setMaxWidth] = useState(200);
    const [maxHeight, setMaxHeight] = useState(200);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (crop) => {
        if (imageSrc && crop.width && crop.height) {
            generateCroppedImage(crop);
        }
    };

    const generateCroppedImage = (crop) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob(blob => {
                const resizedCanvas = document.createElement('canvas');
                let width = canvas.width;
                let height = canvas.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                resizedCanvas.width = width;
                resizedCanvas.height = height;
                resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);

                resizedCanvas.toBlob(resizedBlob => {
                    const resizedFile = new File([resizedBlob], 'cropped_resized_image.jpg');
                    setCroppedImage(resizedFile);
                    
                    // Create preview URL
                    const previewUrl = URL.createObjectURL(resizedBlob);
                    setPreviewSrc(previewUrl);
                }, 'image/jpeg');
            }, 'image/jpeg');
        };
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('avatar', croppedImage);

        fetch('/api/upload-avatar', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                console.log('上传成功');
                setIsModalOpen(false);
            }
        });
    };

    return (
        <div className={`${styles.profile_picture_wrapper} text-center`}>
            <label className={`${styles.avatarName} form_label d_block`}>我的頭像</label>
            <div className="image-container mb-3">
                <img
                    id={styles.profile_avatar}
                    src={avatar.imagelink || "IMG_20240701_124913.JPG"}
                    alt="Profile"
                    className="img-fluid rounded border border-3 border-dark"
                />
            </div>
            <button
                type="button"
                className={`btn btn-dark ${styles.photo}`}
                onClick={() => setIsModalOpen(true)}
            >
                更新頭像
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Crop Avatar"
            >
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {imageSrc && (
                    <>
                        <ReactCrop
                            src={imageSrc}
                            crop={crop}
                            onChange={newCrop => setCrop(newCrop)}
                            onComplete={handleCropComplete}
                        />
                        <div>
                            <label>
                                最大宽度:
                                <input
                                    type="number"
                                    value={maxWidth}
                                    onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
                                />
                            </label>
                            <label>
                                最大高度:
                                <input
                                    type="number"
                                    value={maxHeight}
                                    onChange={(e) => setMaxHeight(parseInt(e.target.value, 10))}
                                />
                            </label>
                        </div>
                        {previewSrc && (
                            <div className="preview-container mt-3">
                                <h3>预览</h3>
                                <img
                                    src={previewSrc}
                                    alt="Cropped Preview"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        )}
                    </>
                )}
                <button type="button" onClick={handleUpload}>確定並上傳</button>
            </Modal>
        </div>
    );
};

export default UserAvatar;