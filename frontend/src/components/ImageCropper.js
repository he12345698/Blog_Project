import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // 引入 Cropper 的 CSS
import styles from "../styles/components/ImageCropper.module.css";

const ImageCropper = ({ src }) => {
    const cropperRef = useRef(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");

    const onCrop = () => {
        const cropper = cropperRef.current.cropper;
        cropper.getCroppedCanvas().toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                setCroppedImageUrl(url);
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
                    guides={false}
                    crop={onCrop}
                    ref={cropperRef}
                />
            </div>
            {croppedImageUrl && (
                <div className={styles.img_preview}>
                    <h3>圖片預覽:</h3>
                    <img src={croppedImageUrl} alt="Cropped" className={styles.img}/>
                </div>
            )}
        </div>
    );
};

export default ImageCropper;
