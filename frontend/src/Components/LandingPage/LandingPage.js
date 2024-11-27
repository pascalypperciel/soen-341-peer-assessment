import { useEffect, useState } from 'react';
import Background from './Background';
import Hero from './Hero';
import Main from '../HeaderLanding/Main';

const LandingPage = ()  => {
  let heroData = [
    {text1:"When one teaches", text2:"two learn"},
    {text1:"To teach is", text2:"to learn twice"},
    {text1:"Give into", text2:"your passions"},
  ]
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setHeroCount((count)=>{return count=== 2?0:count+1})
    }, 3000)
  },[])

  return (
    <div>
      <Main />
      <Background playStatus={playStatus} heroCount={heroCount}/>    
      <Hero
        setPlayStatus = {setPlayStatus}
        heroData = {heroData[heroCount]}
        heroCount = {heroCount}
        setHeroCount = {setHeroCount}
        playStatus = {playStatus}
      />
    </div>
  );
}

export default LandingPage;
