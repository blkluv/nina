import React, { useState } from 'react'
import NextImage from 'next/image'

function Image({ src, height, width, layout, priority }) {
  const [ready, setReady] = useState(false)
  const handleLoad = (event, byPass) => {
    event.persist()
    if (event.target.srcset || byPass) {
      setReady(true)
    }
  }

  const loaderProp = ({ src }) => {
    return src;
  };

  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity .3s ease-in-out',
      }}
      className="imageWrapper"
    >
      <NextImage
        src={src}
        height={height}
        width={width}
        priority={priority}
        layout={layout}
        onLoad={(e) => handleLoad(e, false)}
        loader={loaderProp}
      />
    </div>
  )
}

function srcComparision(prevImage, nextImage) {
  return prevImage.src === nextImage.src && nextImage.release
}

const MemoizedImage = React.memo(Image, srcComparision)
export default MemoizedImage
