const clipperNaviConfigs = [
    {
        title: '页面选择图片',
        type: 1,
        config: {
            show: false,
            zIndex: 99,
            imageUrl: '',
            type: 'url',
            quality: 1,
            width: 400,
            height: 400,
            minWidth: 200,
            maxWidth: 600,
            minHeight: 200,
            maxHeight: 600,
            lockWidth: false,
            lockHeight: false,
            lockRatio: false,
            scaleRatio: 1,
            minRatio: 0.5,
            maxRatio: 2,
            disableScale: false,
            disableRotate: false,
            limitMove: false,
            resultImageUrl: '',
            checkImage: true,
            checkImageIcon: './images/photo.png',
            rotateAlong: true,
            rotateAlongIcon: './images/rotate-along.png',
            rotateInverse: true,
            rotateInverseIcon: './images/rotate-inverse.png',
            sure: true,
            sureIcon: './images/sure.png',
            close: true,
            closeIcon: './images/close.png',
        },
        toolsConfig: {
            zIndex: 999,
            rotateAngle: 90,
            lockWidth: false,
            lockHeight: false,
            lockRatio: false,
            disableScale: false,
            disableRotate: false,
            limitMove: false
        }
    }
];

export default clipperNaviConfigs;
