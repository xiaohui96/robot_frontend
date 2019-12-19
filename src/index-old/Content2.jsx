import React from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import VideoPlay from 'react-sublime-video';

class Content extends React.Component {

  static defaultProps = {
    className: 'content3',
  };

  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const animation = { y: '+=30', opacity: 0, type: 'from', ease: 'easeOutQuad' };
    // const videoChildren = 'https://os.alipayobjects.com/rmsportal/EejaUGsyExkXyXr.mp4';
    // const videoChildren = 'http://www.powersim.whu.edu.cn/ncslab//userfiles/file/BallBeam.avi';
    // const videoChildren = 'http://202.114.96.192/vjs.zencdn.net/v/oceans.webm';
    const videoChildren = 'https://www.powersim.whu.edu.cn/ncslab//userfiles/file/1053818873.mp4';
    const videoType = 'video/mp4';

      return (
      <div {...props} className={`content-template-wrapper ${props.className}-wrapper`}>
        <OverPack
          className={`content-template ${props.className}`}
          location={props.id}
        >
          <TweenOne
            animation={animation}
            component="h1"
            key="h1"
            reverseDelay={300}
            id={`${props.id}-title`}
          >
            球杆系统控制实验演示视频
          </TweenOne>
          <TweenOne
            key="video"
            animation={{ ...animation, delay: 300 }}
            className={`${props.className}-video`}
            id={`${props.id}-video`}
          >
            {isMode ?
              (<video src={videoChildren} type={videoType} width="100%" height={'100%'} loop controls="true"/>) :
              (<VideoPlay loop src={videoChildren} width="100%" controls="true" style={{height:'85%'}}/>)}
          </TweenOne>
        </OverPack>
      </div>
    );
  }
}


export default Content;
