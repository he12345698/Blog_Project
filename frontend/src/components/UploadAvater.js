// 編輯頭像
import { useState } from 'react';
import { request } from 'umi';
import { Button, Image, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import userAvatar from '../../public/IMG_20240701_124913.JPG';// 默認頭像

/**
 * @param  avatar     傳入頭像
 * @param  setAvatar  設置頭像方法
 */
const UploadAvatar = ({ avatar, setAvatar }) => {
    // * 按鈕loading
    const [loading, setLoading] = useState(false);
    // todo 上傳前校驗
    const beforeUpload = (file) => {
        // 驗證是否為jpeg/png
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('請上傳(JPG/PNG)圖片');
            return Upload.LIST_IGNORE;
        };

        // 驗證上傳圖片檔案大小
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('請上傳10M以内的圖片');
            return Upload.LIST_IGNORE;
        };

        return isJpgOrPng && isLt2M;
    };
    // * Upload設定
    const uoloadProps = {
        showUploadList: false,
        // 校驗
        beforeUpload,
        // 設定上傳狀態
        onChange: ({ file: { status } }) => {
            switch (status) {
                case 'uploading':
                    setLoading(true);
                    break;
                case 'done':
                    setLoading(false);
            };
        },
        customRequest: async ({ file }) => {
            const formData = new FormData();
            formData.append('avatarfile', file);

            try {
                // xxx 为图片上传地址
                const { data } = await request('/xxx', {
                    method: 'POST',
                    data: formData
                });

                if (data) {
                    setAvatar(data);
                    setLoading(false);
                };
            } catch (err) { console.log(err) };
        }
    };

    return (
        <div>
            <Image
                width={90}
                src={avatar}
                placeholder={<img src={userAvatar} width={90} />}
                fallback={userAvatar}
            />

            <div>
                <ImgCrop rotate grid>
                    <Upload {...uoloadProps}>
                        <Button type="primary" ghost loading={loading}>修改头像</Button>
                    </Upload>
                </ImgCrop>
            </div>
        </div>
    );
};

export default UploadAvatar;