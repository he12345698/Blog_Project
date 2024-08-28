import React, { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import styles from "../styles/components/ImageCropper.module.css";

const ImageCropper = ({ src }) => {
    const [imageDestination, setImageDestination] = useState("");
    const imageElement = useRef(null);

    useEffect(() => {
        const cropper = new Cropper(imageElement.current, {
            zoomable: false,
            scalable: false,
            aspectRatio: 1,
            crop: () => {
                const canvas = cropper.getCroppedCanvas();
                setImageDestination(canvas.toDataURL("image/png"));
            }
        });

        return () => {
            cropper.destroy();
        };
    }, []);

    return (
        <div>
            <div className={styles.img_container}>
                <img ref={imageElement} src={src} alt="Source" />
            </div>
            <img className={styles.img_preview} src={imageDestination} alt="Destination" />
        </div>
    );
};

export default ImageCropper;
