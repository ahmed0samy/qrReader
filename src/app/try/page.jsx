'use client';

import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push({
      pathname: '/',
      query: { key1: 'value1', key2: 'value2' }
    });
  };

  return (
    <button onClick={handleClick}>
      Go to another route with query
    </button>
  );
};

export default Home;
