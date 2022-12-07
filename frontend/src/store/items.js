export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});

// thunk action creator for fetching items for a single Pokemon - dispatched in the PokemonItems component.
export const getItems = (pokemonId) => async (dispatch) => {
  const url = `/api/pokemon/${pokemonId}/items`;
  const request = {
    method: 'GET'
  };

  const response = await fetch(url, request);

  if (response.ok) {
    const items = await response.json();
    dispatch(load(items, pokemonId));
    return items;
  }
}; 

// thunk action creator for editing an item - dispatched in the ItemForm component.
export const editItem = (payload) => async (dispatch) => { 
  const url = `/api/items/${payload.id}`; 
  const request = { 
    method: 'PUT', 
    headers: { 
      'Content-Type': 'application/json', 
    }, 
    body: JSON.stringify(payload)
  }; 
  
  const response = await fetch(url, request); 

  if (response.ok) { 
    let updatedItem = await response.json(); 
    dispatch(update(updatedItem)); 
    return updatedItem; 
  }
}; 

// thunk action creator for adding an item - dispatched in the itemForm component. 
export const createItem = (payload) => async (dispatch) => { 
  const url = `/api/pokemon/${payload.pokemonId}/items`;
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  };
  console.log(JSON.stringify(request.body))
  console.log(payload.id)

  const response = await fetch(url, request);

  if (response.ok) {
    let newItem = await response.json();
    dispatch(add(newItem));
    return newItem;
  }
}

// thunk action creator for deleting an item - dispatched in the ItemForm comopnent. 
export const removeItem = (itemId, pokemonId) => async (dispatch) => { 
  const url = `/api/items/${itemId}` 
  const request = { 
    method: 'DELETE'
  }

  const response = await fetch(url, request);

  if (response.ok) {
    const itemId = await response.json(); 
    dispatch(remove(itemId.id, pokemonId)); 
  }

}; 

// thunk action creator for adding an item to database - dispatched in PokemonItem component. 

const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS: 
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    case REMOVE_ITEM: 
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    case ADD_ITEM:
    case UPDATE_ITEM: 
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;
