export const camera = {
    getMedia:  function () {
            let constraints = {
                video: {
                 width: 600,
                 height: 400
                },
            audio: true
            };
            //获得video摄像头区域
            let video = document.getElementById("video");
            // 这里介绍新的方法，返回一个 Promise对象
            // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
            // then()是Promise对象里的方法
            // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
            // 避免数据没有获取到
            let promise = navigator.mediaDevices.getUserMedia(constraints);
            // 成功调用
        console.log(promise); // 对象
        promise.then(function (MediaStream) {
             /* 使用这个MediaStream */
             video.srcObject = MediaStream;
             video.play();
             console.log(MediaStream); // 对象
             })
            // 失败调用
            promise.catch(function (err) {
            /* 处理error */
            console.log(err); // 拒签
            });
            },

    takePhoto: function () {
        //获得Canvas对象
        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 600, 400);
    }

}