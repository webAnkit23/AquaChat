import React from 'react'
const style ={
  objectFit: 'cover',
  margin:'0px',
      height: '100%',
      zIndex: '-1',
      position: 'fixed',
      width: '100%',
      overflow:'hidden'
      
}
export default function BackgroundVideo({src}) {
  return (
    <video style={style} id="bannerVideo" autoPlay muted loop>
          <source src={src} type="video/mp4" />
        </video>
  )
}

