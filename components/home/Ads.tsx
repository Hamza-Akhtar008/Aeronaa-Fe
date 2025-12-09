import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import Image from 'next/image';

const Ads = () => {
  const backgroundImages = ['/images/Ad1.jpg','/images/Ad2.jpg'];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
   <Card className="relative items-center rounded-2xl w-[90%] h-80 overflow-hidden ml-auto mr-auto mt-10">
  <Image
    src={backgroundImages[bgIndex]}
    alt="Background slideshow"
    fill
    className="object-cover transition-all duration-1000"
    priority // or use loading="eager" if you don't want lazy-loading
  />
</Card>
  );
};

export default Ads;
