const database = 'http://localhost:3000/moves';
const usersDb = 'http://localhost:3000/users';
const movesList = document.getElementById('moves-list');
const userList = document.getElementById('user-list');
const createUser = document.getElementById('create-user');
const loadChoreoList = document.getElementById('load-choreo');
const choreoList = document.getElementById('choreo-list');
const clearButton = document.getElementById('clear-choreo');
const saveComboName = document.getElementById('comboName');
const clearSearchbtn = document.getElementById('clear-search');

loadTapMoves(database);
loadUserList();
document.getElementById('name-form').addEventListener('submit', handleSearch);
document.getElementById('sounds-form').addEventListener('submit', handleSearch);
document.getElementById('save-choreo').addEventListener('submit', handleSave);
userList.addEventListener('change', handleSelectUser);
createUser.addEventListener('submit', createNewUser);
loadChoreoList.addEventListener('change', handleSelectCombination);
clearButton.addEventListener('click', handleClearChoreo);
clearSearchbtn.addEventListener('click', handleClearSearch);


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

function handleClearSearch() {
    clearSection(movesList);
    loadTapMoves(database);
}

//** Search Section - handles searching full dictionary by Name and by Number of Sounds */

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

//** Sidebar Section: Handles adding and removing steps from current combination,
// creating new Users, and loading combinations */

function loadUserList(selection = 0) {
    fetch(usersDb)
    .then(res => res.json())
    .then(json => {
        clearSection(userList);
        loadOneUser(0, 'Select a User');
        json.forEach(user => loadOneUser(user.id, user.name));
        userList[selection].selected = true;
    });
}

function handleClearChoreo(e) {
    clearSection(choreoList);
}

function handleAddStep(e) {
    addStepToChoreo(e.target.parentNode);
}

function addStepToChoreo(step) {
    const move = step.cloneNode(true);
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

    const userId = userList.value;
    const comboName = e.target.comboName.value;
    const moves = getCombination(e.target.parentNode.querySelector('#choreo-list').children);
    const combination = {
        "name": comboName,
        "moves": moves
    };

    if (loadChoreoList.nameList.value !== saveComboName.value) {
        fetch(`${usersDb}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const comboList = user.combinations;
            comboList.push(combination);
            fetch(`${usersDb}/${userId}`, makePatchJson(comboList))
            .then(loadCombinationList(userId, combination.name));
        })
    } else {
        fetch(`${usersDb}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const comboList = user.combinations;
            const currCombo = comboList.find(element => element.name === combination.name);
            currCombo.moves = combination.moves;
            fetch(`${usersDb}/${userId}`, makePatchJson(comboList))
            .then(loadCombinationList(userId, combination.name));
        })
    }
}

function makePatchJson(comboList) {
    return {
        method: 'PATCH',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            combinations: comboList
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

function loadOneUser(userId, userName) {
    const currUser = document.createElement('option');
    currUser.value = userId;
    currUser.setAttribute('name', userName);
    currUser.textContent = userName;
    userList.appendChild(currUser);

}

function loadCombinationList(userId, selection = 'Select a Combination') {
    clearSection(loadChoreoList.nameList);

    fetch(`${usersDb}/${userId}`)
    .then(res => res.json())
    .then(user => {
        loadOneListCombo('Select a Combination');
        if (user.combinations !== []) {
            user.combinations.forEach(combo => loadOneListCombo(combo.name));
        }
        console.log(selection);
        loadChoreoList.nameList.querySelector(`[value="${selection}"]`).selected = true;
    })
}

function loadOneListCombo(name) {
    const newCombo = document.createElement('option');
    newCombo.value = name;
    newCombo.text = name;
    loadChoreoList.nameList.appendChild(newCombo);
}

function createNewUser(e) {
    e.preventDefault();
    const newUserName = e.target['new-user-name'].value;
    if (userList.options.namedItem(newUserName) === null) {
        fetch(usersDb, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': newUserName,
                'combinations': []
            })
        })
        .then(res => res.json())
        .then(json => loadUserList(json.id));
    } else {
        window.alert('That username already exists!');
    }
}

function handleSelectUser(e) {
    const userId = e.target.selectedIndex;
    loadCombinationList(userId);
}

function handleSelectCombination(e) {
    const selectedCombo = e.target.value;
    const userId = userList.selectedIndex;
    
    fetch(`${usersDb}/${userId}`)
    .then(res => res.json())
    .then(user => {
        const combination = user.combinations.find(element => element.name === selectedCombo);
        loadMovesFromCombo(combination);
        saveComboName.value = combination.name;
    });
}

function loadMovesFromCombo(combination) {
    clearSection(choreoList);
    combination.moves.forEach(move => {
        const currMove = document.getElementById(move);
        addStepToChoreo(currMove);
    })
}