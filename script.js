const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2308-ACC-ET-WEB-PT-A';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`);
        const result = await response.json();
        const players = result.data.players;
        return players;
     } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        return [];
       
    }
}

async function fetchSinglePlayer(playerId) {
    try {
        const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/player/${playerId}`);
        const result = await response.json();
        const player = result.data.player;
        return player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player # ${playerId} !`, err);
        return null;
    }
}

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`, {
            method: 'POST',
            headers: {
               'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ player: playerObj })
        });
        const result = await response.json();
        return result.data.player;
        } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
        return null;
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/player/${playerId}`, {
            method: 'DELETE'
           });
           const result = await response.json();
           return result.success;
           } catch (err) {
           console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
           return false;
        }
  }
 const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach((player) => {
            playerContainerHTML += `
        <div class="container">
         <div class="player-card">
          <img src="${player.imageUrl}" alt="${player.name}">
            <h2>${player.name}</h2>
            <p>${player.breed}</p>
            <p>${player.status}</p>
              <button class="details-button" data-player-id="${player.id}">See details</button>
              <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
          </div>
        </div>`;
        });
        playerContainer.innerHTML = playerContainerHTML;
        // buttons in each player card
        const seeDetailsBtns = document.querySelectorAll('.details-button');
        const removeFromRosterBtns = document.querySelectorAll('.remove-button');

 //details about player
         seeDetailsBtns.forEach((btn) => {
            btn.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.playerId;
                const player = await fetchSinglePlayer(playerId);
                console.log(player);        
               });
            });
        
         removeFromRosterBtns.forEach((btn) => {
           btn.addEventListener('click', async (event) => {
                const playerId = event.target.dataset.playerId;
                const success = await removePlayer(playerId);
                console.log(success);
             });
           });
  
        } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
}



 //render a form 

 
const renderNewPlayerForm = () => {
    try {
        // Create the form element
        const newPlayerForm = document.createElement('form');

        newPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // retrieve form data
            const formData = new FormData(newPlayerForm);
            await addNewPlayer(Object.fromEntries(formData));

            // request to add the new player
            const players = await fetchAllPlayers();

            // render all players
            renderAllPlayers(players);

            // Clear the form
            newPlayerForm.reset();
        });

        // Append the form
        newPlayerFormContainer.appendChild(newPlayerForm);
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}
const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
}

init();
