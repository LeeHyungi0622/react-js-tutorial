import React, { useContext, useCallback, memo, useMemo } from 'react';
import { CODE, OPEN_CELL, TableContext, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL } from './MineSearch';

const getTdStyle = (code) => {
    switch(code) {
        case CODE.NORMAL:
        case CODE.MINE:
            return{
                background: '#444',
            }
        case CODE.CLICKED_MINE:
        case CODE.OPENED:
            return{
                background: 'white',
            };
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return{
                background: 'yellow',
            }
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return{
                background: 'red',
            }
        default:
            return{
                background: 'white',
            };
    }
};

const getTdText = (code) => {
    console.log('getTdText rendering');
    switch(code){
        case CODE.NORMAL:
            return '';
        case CODE.MINE:
            return 'X';
        case CODE.CLICKED_MINE:
            return '펑';
        // 칸에 지뢰가 있다고 확신이 드는 경우 표시
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return '!';
        // 칸에 지뢰가 있는지 없는지 모르겠을 경우(확신이 없을때) 물음표
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return '?';
        default:
            return code || '';
    }
};

// 마우스 이벤트 (오른쪽 클릭하면 깃발-물음표-정상상태로 변화)

const Td = memo(({rowIndex, cellIndex}) => {
    const { tableData, dispatch, halted } = useContext(TableContext);
    const onClickTd = useCallback(() => {
        // 게임 상태가 종료가 되었으면 아무런 클릭 이벤트도 처리하지 않는다.
        if(halted){
            return;
        }
        // 클릭했을때 클릭된 칸의 데이터별로 다른 동작을 하도록 처리
        switch(tableData[rowIndex][cellIndex]){
            // 클릭한 칸이 이미 열려있는 칸이거나 지뢰가 위치한 깃발 칸
            // 혹은 깃발이 꼿힌 칸이거나 지뢰가 위치한 물음표 칸이거나
            // 물음표가 위치한 칸을 클릭한 경우에는 아무 이벤트가 발생하지 않는다.
            case CODE.OPENED:
            case CODE.FLAG_MINE:
            case CODE.FLAG:
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                return
            // 일반 칸의 경우, 셀을 오픈한다.
            case CODE.NORMAL:
                dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex});
                return;
            // 클릭한 칸이 지뢰가 위치한 칸인 경우, 터지게 만든다.
            case CODE.MINE:
                dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
        }
    },[tableData[rowIndex][cellIndex], halted]);
    const onRightClickTd = useCallback((e) => {
        e.preventDefault();
        if(halted){
            return;
        }
        switch(tableData[rowIndex][cellIndex]){
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
                return;
            case CODE.FLAG_MINE:
            case CODE.FLAG:
                dispatch({ type: QUESTION_CELL, row:rowIndex, cell: cellIndex });
                return;
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
                dispatch({ type: NORMALIZE_CELL, row:rowIndex, cell: cellIndex });
                return;
            default:
                return;
        }
    }, [tableData[rowIndex][cellIndex], halted]);
    console.log('td rendering');
    return useMemo(() => (
            <td
            style={getTdStyle(tableData[rowIndex][cellIndex])}
            onClick={onClickTd}
            onContextMenu={onRightClickTd}
            >{getTdText(tableData[rowIndex][cellIndex])}</td>
    ), [tableData[rowIndex][cellIndex]]);
});

export default Td;