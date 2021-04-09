const React = require('react');

// functional component
// 함수형 컴포넌트는 setState나 ref를 사용하지 않는 경우에 사용을 했었다.
// 그런데 함수형 컴포넌트에서도 setState와 ref를 사용한 상태관리를 할 수 있게 해주었다.
const MultiplicationTable = () => {
    const [first, setFirst] = React.useState(Math.ceil(Math.random() * 9));
    const [second, setSecond] = React.useState(Math.ceil(Math.random() * 9))
    const [value, setValue] = React.useState('');
    const [result, setResult] = React.useState('');
    const inputRef = React.useRef(null);

    const onChangeInput = (e) => {
        setValue(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(value, first, second);
        if(Number(value) === (first * second)){
            setResult('정답입니다.'+ value);
            setFirst(Math.ceil(Math.random()*9));
            setSecond(Math.ceil(Math.random()*9));
            setValue('');
            inputRef.current.focus();
        }else{
            setResult('틀렸습니다.');
            setValue('');
            inputRef.current.focus();
        }
    }

    return (
        <React.Fragment>
                <div>{first} 곱하기 {second}는</div> 
                <form onSubmit={onSubmit}>
                    <input ref={inputRef} onChange={onChangeInput} value={value}/>
                    <button>입력!</button>    
                </form>
                <div id="result">{result}</div>
        </React.Fragment>
    )
}

module.exports = MultiplicationTable;