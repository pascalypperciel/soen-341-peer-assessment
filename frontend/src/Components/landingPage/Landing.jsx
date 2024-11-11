import { useEffect, useState } from 'react';
import Background from './Background/Background';
import Hero from './Hero/Hero';
import Header2 from '../header2/Header2';

const Landing = ()  => {
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
      <Header2 />
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

export default Landing;
