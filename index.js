const database = 'http://localhost:3000/moves';
const movesList = document.getElementById('moves-list');
const choreoList = document.getElementById('choreo-list');

document.addEventListener('DOMContentLoaded', function () {
    loadTapMoves(database);
    document.getElementById('name-form').addEventListener('submit', handleSearch);
    document.getElementById('sounds-form').addEventListener('submit', handleSearch);
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
    
    const addBtn = document.createElement('button');
    addBtn.setAttribute('class', 'btn');
    addBtn.innerText = '+';
    addBtn.addEventListener('click', handleAddStep);
    
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

function handleSearch(e) {
    e.preventDefault();
    const searchForm = e.target;
    const searchText = searchForm.querySelector('.searchInput').value;
    
    fetch(database)
    .then(res => res.json())
    .then(json => {
        const flatDb = flattenDb(json);
        let filteredMoves;
        if (searchForm.name === 'search-by-name') {
            filteredMoves = flatDb.filter(move => searchByName(move, searchText));
        } else if (searchForm.name === 'search-by-sounds') {
            filteredMoves = flatDb.filter(move => searchBySounds(move, searchText));
        };
        clearSection(movesList);
        filteredMoves.forEach(move => loadOneTapMove(move));
    });

    searchForm.reset();
}

function searchByName(e, searchText) {
    return e.name.toLowerCase().includes(searchText.toLowerCase());
}

function searchBySounds(e, searchText) {
    return parseInt(e.countsNumber) === parseInt(searchText);
}

function flattenDb(db) {
    const newDb = [];
    db.forEach(move => {
        newDb.push(move);
        if (move.altMoves !== []) {
            move.altMoves.forEach(alt => newDb.push(alt));
        };
    });
    return newDb;
}

function clearSection(e) {
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }
}