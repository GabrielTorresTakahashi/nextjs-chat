'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      // Se estiver logado
      router.push('/welcome');
    } else {
      // Se não estiver logado
      router.push('/login');
    }
  }, []);

  return <div>Redirecionando...</div>;
};

export default Home;
