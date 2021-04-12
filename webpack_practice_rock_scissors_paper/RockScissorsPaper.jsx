import React, { useState, useRef, useEffect } from 'react';

const rspCoords = {
    rock: '0',
    scissors: '-142px',
    paper: '-284px',
};

const scores = {
    rock: 1,
    scissors: 0,
    paper: -1
};

const computerChoice = (imgCoord) => {
    return Object.entries(rspCoords).find(function(v) {
        return v[1] === imgCoord;
    })[0];
}

const RockScissorsPaper = () => {
    const [result, setResult] = useState('');
    const [score, setScore] = useState('');
    const [imgCoord, setImgCoord] = useState(rspCoords.rock);
    const interval = useRef();


    useEffect(() => { // componentDidMount, componentDidUpdate 역할(1대1 대응은 아님)
        interval.current = setInterval(changeHand, 100);
        return () => { // componentWillUnmount 역할 
            clearInterval(this.interval.current);
        }
    }, [imgCoord]);

    const changeHand = () => {
        if(imgCoord === rspCoords.rock) {
            setImgCoord(rspCoords.scissors);
        } else if(imgCoord === rspCoords.scissors){
            setImgCoord(rspCoords.paper);
        } else if(imgCoord === rspCoords.paper){
            setImgCoord(rspCoords.rock);
        }
    };

    const onClickBtn = (choice) => () => {
        clearInterval(interval.current);
        const myScore = scores[choice];
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if(diff === 0){
            setResult('비겼습니다.');
        } else if([-1, 2].includes(diff)){
            setResult('이겼습니다.');
            setScore((prevScore) => prevScore + 1);
        } else {
            setResult('졌습니다.');
            setScore((prevScore) => prevScore - 1);
        }
        // 2초동안 결과를 확인하고 다시 재시작 
        setTimeout(() => {
            interval.current = setInterval(changeHand, 100);
        }, 2000)
    };

    return (
        <>
            <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
            <div>
            <button id="rock" className="btn" onClick={onClickBtn('rock')}>rock</button>
            <button id="scissor" className="btn" onClick={onClickBtn('scissors')}>scissors</button>
            <button id="paper" className="btn" onClick={onClickBtn('paper')}>paper</button>
            </div>
            <div>{result}</div>
            <div>현재 {score}점</div>
        </>
    )
}

export default RockScissorsPaper;