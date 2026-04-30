import React from 'react';

function LazyImage({ src, alt, ...props }) {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [imageRef, setImageRef] = React.useState();

  React.useEffect(() => {
    let observer;

    if (imageRef && imageSrc === null) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [imageRef, imageSrc, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      {...props}
    />
  );
}

export default LazyImage;