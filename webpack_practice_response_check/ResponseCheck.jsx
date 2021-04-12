import React, { useState, useRef } from 'react';

const ResponseCheck = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭해서 시작하세요.');
    const [result, setResult] = useState([]);
    let timeout = useRef(null);
    let startTime = useRef();
    let endTime = useRef();

    const onClickScreen = () => {
        if (state === 'waiting'){
            setState('ready');
            setMessage('초록색이 되면 클릭하세요.');
            
            timeout.current = setTimeout(() => {
                setState('now');
                setMessage('지금 클릭');
                startTime.current = new Date();
                // 2 ~ 3초 (랜덤 시간(초)로 바뀐다.)
            }, Math.floor(Math.random()*1000)+2000);
        // 빨간색 (클릭시 성급하게 클릭)
        } else if (state === 'ready') {
            // 기존에 실행한 setTimeout을 제거하고, 
            // state를 'waiting'으로 바꾸기 (한 번 더 기회)
            clearTimeout(timeout);
            setState('waiting');
            setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
        // 반응속도 체크 구간 (하늘색)
        } else if (state === 'now') {
            endTime.current = new Date();
            setState('waiting');
            setResult([]);
            setMessage('클릭해서 시작하세요!');
            setResult((prevResult) => [...prevResult, endTime.current - startTime.current]);
        }
    };

    const onReset = () => {
        setResult([]);
    }

    const renderAverage = () => {
        console.log(result);
        return result.length === 0 
        ? null 
        : <>
            <div>평균시간 : {result.reduce((a, c) => a + c) / result.length}ms</div>
            <button onClick={onReset}>리셋</button>
          </>
    }

    return (
        <>
            <div
                id="screen"
                className={state}
                onClick={onClickScreen}>
                {message}
            </div>
            {renderAverage()}  
        </>
    )
}

export default ResponseCheck;