'use client'
import { useEffect } from 'react';

const TawkTo = () => {
  useEffect(() => {
    const scriptId = 'tawkto-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = "https://embed.tawk.to/650376840f2b18434fd897f2/1haaoduf8";
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.body.appendChild(script);
    }
  }, []);

  return null;
};

export default TawkTo;
