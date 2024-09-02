import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import styles from "../styles/components/ImageCropper.module.css";

const ImageCropper = ({ src, onCrop }) => {
    const cropperRef = useRef(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");
    const [croppedBlob, setCroppedBlob] = useState(null); // 儲存裁剪後的 Blob

    const onCropEnd = () => {
        const cropper = cropperRef.current.cropper;
        cropper.getCroppedCanvas().toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                setCroppedImageUrl(url);
                setCroppedBlob(blob); // 儲存 Blob 以便上傳
                if (onCrop) onCrop(blob); // 將裁剪後的 Blob 傳遞給父組件
            }
        }, "image/jpeg");
    };

    return (
        <div>
            <div className={styles.img_container}>
                <Cropper
                    src={src}
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    aspectRatio={1}
                    guides={true}
                    zoomable={false}
                    highlight={true}
                    cropend={onCropEnd}
                    viewMode={2} // 確保裁切框不能超出圖片
                    minCropBoxWidth={150} // 設定最小裁切框寬度
                    minCropBoxHeight={150} // 設定最小裁切框高度
                    ref={cropperRef}
                />
            </div>
            <h3 className={styles.h3}>圖片預覽:</h3>
            {croppedImageUrl && (
                <div className={styles.img_preview}>
                    <img src={croppedImageUrl} alt="Cropped" className={styles.img} />
                </div>
            )}
        </div>
    );
};

export default ImageCropper;
