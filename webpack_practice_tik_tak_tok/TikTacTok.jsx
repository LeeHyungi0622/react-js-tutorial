import React,{ Component, useCallback, useRef, useState, useReducer, useEffect } from 'react';
import Table from './table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
                ['','',''],
                ['','',''],
                ['','','']
    ],
    // 최근에 클릭한 셀이 무엇인지 기억 
    recentCell: [-1, -1]
};

export const SET_WINNER = 'SET_WINNER';
// Td에서 사용
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

const reducer = (state, action) => {
    switch(action.type){
        case SET_WINNER:
            //state.winner = action.winner
            return {
                ...state,
                // 기존 state에서 바뀌는 부분만 업데이트
                winner: action.winner,
            }
        case CLICK_CELL:
            // 객체를 얕은 복사를 해서 사용
            const tableData = [...state.tableData];
            // 불변성 지키는데에 단점이다 (immer라는 라이브러리로 가독성 해결)
            tableData[action.row] = [...tableData[action.row]];
            tableData[action.row][action.cell] = state.turn;
            return {
                ...state,
                tableData,
                recentCell: [action.row, action.cell]
            };
        case CHANGE_TURN: 
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O'
            }
        case RESET_GAME:
            return {
                ...state,
                turn: 'O',
                tableData: [
                    ['','',''],
                    ['','',''],
                    ['','','']
                ],
                recentCell: [-1, -1],
            }
    };
};

const TikTacTok = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, turn, winner, recentCell } = state;
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('O');
    // const [tableData, setTableData] = useState([['','',''],['','',''],['','','']]);
    const onClickTable = useCallback(() => {
        dispatch({ type: SET_WINNER, winner: 'O'});
    }, []);

    //table데이터가 바뀌었을때 검사를 한다.
    useEffect(() => {
        const [row, cell] = recentCell;
        // 초기 클릭한 셀이 [-1, -1]로 초기화가 되어있기 때문에 조건처리
        if(row < 0) {
            return;
        }
        let win = false;
        // 가로줄 검사
        if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
            win = true;
        }
        // 세로줄 검사
        if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
            win = true;
        }
        // 왼쪽에서 오른쪽으로 대각선 검사
        if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
            win = true;
        }
        // 오른쪽에서 왼쪽 대각선 검사
        if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
            win = true;
        }
        if(win){
            // 승리시
            dispatch({ type: SET_WINNER, winner: turn});
            dispatch({ type: RESET_GAME });
        } else {
            // 무승부 검사
            let all = true; // all이 true이면 무승부라는 뜻
            // 칸이 하나라도 안차있으면, 
            tableData.forEach((row) => { //무승부 검사
                row.forEach((cell) => {
                    if(!cell){
                        all = false;
                    }
                })
            })
            if(all){
                dispatch({ type: RESET_GAME });
            } else{
                // 이긴것이 아닌 경우에 change turn
                dispatch({ type: CHANGE_TURN });
            }
        }
    },[recentCell]);

    return (
        <>
            <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
            {winner && <div>{winner}님의 승리</div>}
        </>
    )
};

export default TikTacTok;
