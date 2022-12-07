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

// thunk action creator for fetching items for a single Pokemon in the PokemonItems component
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

// thunk action create for editing an item in the ItemForm component
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
    let updatedItem = response.json(); 
    dispatch(update(updatedItem)); 
    return updatedItem; 
  }
}; 

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
