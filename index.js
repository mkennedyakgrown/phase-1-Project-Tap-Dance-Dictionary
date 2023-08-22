const database = 'http://localhost:3000/moves';
const usersDb = 'http://localhost:3000/users';
const movesList = document.getElementById('moves-list');
const userList = document.getElementById('user-list');
const loadChoreoList = document.getElementById('load-choreo');
const choreoList = document.getElementById('choreo-list');

loadTapMoves(database);
loadUserList();
document.getElementById('name-form').addEventListener('submit', handleSearch);
document.getElementById('sounds-form').addEventListener('submit', handleSearch);
document.getElementById('save-choreo').addEventListener('submit', handleSave);
userList.addEventListener('change', handleSelectUser);

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
    sounds.setAttribute('class', 'sounds');
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
        if (searchForm.id === 'name-form') {
            filteredMoves = flatDb.filter(move => searchByName(move, searchText));
        } else if (searchForm.id === 'sounds-form') {
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

function handleAddStep(e) {
    const move = e.target.parentNode.cloneNode(true);
    move.setAttribute('class', 'parentMove');
    const btn = move.firstChild;
    btn.innerText = 'X';
    btn.addEventListener('click', handleRemoveStep);

    choreoList.appendChild(move);
}

function handleRemoveStep(e) {
    const move = e.target.parentNode;
    choreoList.removeChild(move);
}

function handleSave(e) {
    e.preventDefault();

    const userName = e.target.saveName.value;
    const comboName = e.target.comboName.value;
    const combination = getCombination(e.target.parentNode.querySelector('#choreo-list').children);

    fetch(usersDb, makePostJson(userName, comboName, combination))
    .then(loadCombinationList());
    
    e.target.reset();
}

function loadCombinationList() {
    console.log('loading combo list');
}

function makePostJson(userName, comboName, combination) {
    return {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userName': userName,
            'comboName': comboName,
            'combination': combination
        })
    };
}

function getCombination(comboList) {
    const comboArray = [];
    for (move in comboList) {
        if (typeof(comboList[move]) === 'object') {
            comboArray.push(comboList[move].id);
        };
    };
    return comboArray;
}

function loadUserList() {
    fetch(usersDb)
    .then(res => res.json())
    .then(json => {
        json.forEach(user => loadOneUser(user));
    });
}

function loadOneUser(user) {
    const currUser = document.createElement('option');
    currUser.value = user.name;
    currUser.textContent = user.name;
    userList.appendChild(currUser);

}

function handleSelectUser(e) {
    console.log(`user ${e.target.value} selected`);
}