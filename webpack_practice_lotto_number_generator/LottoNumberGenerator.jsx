import React, { useEffect, useMemo, useRef, useState, useCallback} from 'react';
import Ball from './Ball';

// 로또 당첨숫자 7개 뽑는 함수
// 계산량이 많은 함수이기 때문에 반복 실행되면 안된다.
function getWinNumber(){
    console.log('getWinNumber');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while(candidate.length > 0){
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumber = shuffle.splice(0, 6).sort((p, c) => p - c);
    return [...winNumber, bonusNumber];
}


const LottoNumberGenerator = () => {
    const lottoNumbers = useMemo(() => getWinNumber(), [winBalls]);
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    // const [winNumbers, setWinNumbers] = useState(getWinNumber());
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);
    

    const onClickRedo = useCallback(() => {
        console.log(winNumbers);
        console.log('onClickRedo');
        setWinNumbers(getWinNumber());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];
    }, [winNumbers]);

    useEffect(() => {
        console.log('useEffect');
        for(let i = 0; i < winNumbers.length - 1; i++) {
            // winNumbers의 숫자를 winBalls에 하나씩 넣어주면, render함수가 실행되면서
            // 화면에 순차적으로 그려주게 된다. 
                timeouts.current[i] = setTimeout(() => {
                    setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]); 
                }, (i + 1) * 1000);
            }
        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);
        return () => {
            timeouts.current.forEach((v) => {
                clearTimeout(v);
            });
        };
    }, [timeouts.current]); // 빈 배열이면 componentDidMount와 동일

    return(
        <>
            <div>당첨 숫자</div>
            <div id="resultWindow">
                { winBalls.map((v) => <Ball key={v} number={v} />) }
            </div>
            <div>보너스!</div>
            { bonus && <Ball number={ bonus } /> }
            { redo && <button onClick={onClickRedo}>한 번 더!</button>}    
        </>  
    )
};


export default LottoNumberGenerator;