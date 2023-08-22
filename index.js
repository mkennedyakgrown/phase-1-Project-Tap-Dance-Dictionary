const database = 'http://localhost:3000/moves';
const movesList = document.getElementById('moves-list');

document.addEventListener('DOMContentLoaded', function () {
    loadTapMoves(database);
})

function loadTapMoves(url) {
    fetch(url)
    .then(res => res.json())
    .then(json => {
        json.forEach(move => {
            loadOneTapMove(move)
            if (move.altMoves !== []) {
                move.altMoves.forEach(altMove => loadOneTapMove(altMove, false));
            }
        });
    });
}

function loadOneTapMove(move, isParent = true) {
    const newMove = document.createElement('li');
    newMove.setAttribute('id', move.name);
    const name = document.createElement('span');
    name.innerText = move.name;
    name.setAttribute('class', 'name');
    const altNames = document.createElement('span');
    altNames.innerText = ` (${parseList(move.altNames, ', ')})`;
    altNames.setAttribute('class', 'altNames');
    const counts = document.createElement('span');
    counts.innerText = ` - ${parseList(move.counts, ' or ')}`;
    counts.setAttribute('class', 'counts');
    const sounds = document.createElement('span');
    sounds.innerText = ` - ${move.sounds}`;
    
    if (altNames.innerText != ' ()') {
        newMove.append(addBtn, name, altNames, counts, sounds);
    } else {
        newMove.append(addBtn, name, counts, sounds);
    };
    if (isParent === false) {
        newMove.setAttribute('class', 'childMove');
    } else {
        newMove.setAttribute('class', 'parentMove');
    }

    movesList.appendChild(newMove);
}

function parseList(names, separator) {
    let namesString = names.toString();
    namesString = namesString.replaceAll(',', separator);
    return namesString;
}