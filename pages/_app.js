import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.default.init({ duration: 550, easing: 'ease-out-cubic', once: true, offset: 30 });
    });
    import('aos/dist/aos.css');
  }, []);

  return <Component {...pageProps} />;
}
