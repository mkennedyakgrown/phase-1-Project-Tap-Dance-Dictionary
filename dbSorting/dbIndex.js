const database = 'http://localhost:3000/moves';

document.addEventListener('DOMContentLoaded', function () {
    let tapMoveElements = document.body.getElementsByClassName('C-10');
    tapMoveElements = tapMoveElements[0].parentNode.parentNode.children;
    const tapMoves = [];
    let i = 0;
    for (element in tapMoveElements) {
        const currMove = tapMoveElements[element];
        if (currMove.textContent !== "" && typeof(currMove) === "object"){
            if (currMove.hasChildNodes() === true && currMove.textContent.indexOf(' - ') !== -1) {
                if (currMove.children[0].className === 'C-10') {
                    tapMoves.push(parseMove(currMove));
                    i++;
                } else {
                    tapMoves[i-1].altMoves.push(parseMove(currMove));
                }
            }
        }
    };
    console.log(tapMoves);
    // postTapMoves(tapMoves, 0);
})

function postTapMoves(tapMoves, i) {
    if (i <= tapMoves.length) {
        try {fetch(database, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(tapMoves[i])
        })
        .then(function () {
            i++;
            postTapMoves(tapMoves, i);
        });}
        catch {console.log('oops...')};
    }
}

function parseMove(currMove) {
    const moveArray = currMove.textContent.split(' - ');
    const moveElement = {
        name: "",
        altNames: [],
        counts: [],
        countsNumber: 0,
        sounds: "",
        altMoves: []
    };
    const parsedNames = parseAltNames(moveArray[0]);
    moveElement.name = parsedNames[0].trimStart();
    moveElement.altNames = parsedNames[1];
    moveElement.counts = moveArray[1].split(' or ');
    moveElement.countsNumber = moveElement.counts[0].replace(' ', '').length;
    moveElement.sounds = moveArray[2];
    return moveElement;
}

function parseAltMoves(move) {
    if (move.parentNode.nextSibling !== null) {
        const nextMove = move.parentNode.nextSibling.nextSibling.childNodes[0]
        if (nextMove.className === 'C-12') {
            parseMove(nextMove.querySelector('.C-11'), '.C-12', '.C-13');
        }
    }
}

function parseCountsAndSounds(move) {
    return move.split(' or ');
}

function parseAltNames(move) {
    if (move.indexOf('(') >= 0) {
        const splitArray = move.split(' (');
        const moveArray = [splitArray[0]];
        let namesString = splitArray[1];
        namesString = namesString.slice(0, namesString.length - 1);
        moveArray.push(namesString.split(', '));
        return moveArray;
    } else {
        return [move, ""];
    }
}

function checkChildren(move, att) {
    const sibs = move.parentNode.querySelectorAll(att);
    if (sibs.length > 0) {
        let child;
        sibs.forEach(sib => {
            if (sib.getAttribute('data-lightbox') === null) {
                child = sib;
            }
        });
        if (child === undefined) {
            return "";
        }
        return child.textContent;
    } else {
        return "";
    }
}