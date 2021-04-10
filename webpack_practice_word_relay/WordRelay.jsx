const React = require('react');
const { useState, useRef } = require('react');


const WordRelay = () => {
    const [word, setWord] = useState('이현기!!*');
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const inputRef = useRef(null);

    const onSubmitForm = (e) => {
        e.preventDefault();
        if(word[word.length - 1] === value[0]){
            setResult('정답입니다.');
            setWord(value);
            setValue('');
            inputRef.current.focus();
        } else {
            setResult('틀렸습니다.');
            setValue('');
            inputRef.current.focus();
        }
    };

    const onChangeInput = (e) => {
        this.setState({ value: e.target.value })
    };

    return (
        <>
            <div>{word}</div>
            <form onSubmit={onSubmitForm}>
                <input ref={inputRef} value={value} onChange={onChangeInput} />
                <button>입력!!</button>
            </form>
            <div>{result}</div>
        </>
    )
    
}

module.exports = WordRelay;