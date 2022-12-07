import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createItem, editItem } from '../store/items';

const ItemForm = ({ itemId, hideForm, pokemonId }) => {
  const isCreateItemForm = pokemonId ? true : false;              // check version of form rendered: create-new-item or update-existing-item
  
  let item = useSelector(state => state.items[itemId]) || {};     
  const dispatch = useDispatch(); 

  // state variables and state updater functions
  const [happiness, setHappiness] = useState(item.happiness || '');
  const [price, setPrice] = useState(item.price || '');
  const [name, setName] = useState(item.name || '');
  const [imageUrl, setImageUrl] = useState(item.imageUrl || '');  // relevant only for create-new-item form

  // onChange functions
  const updateName = (e) => setName(e.target.value);
  const updateHappiness = (e) => setHappiness(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updateImageUrl = (e) => setImageUrl(e.target.value);      // relevant only for create-new-item form

  const imageUrlInputElement = (                                  // relevant only for create-new-item form
    <input
      type="text"
      placeholder="Image URL"
      value={imageUrl}
      onChange={updateImageUrl}
    />
  )

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...item,
      name,
      happiness,
      price,
      imageUrl,                                                   // relevant only for create-new-item form
      pokemonId                                                   // relevant only for create-new-item form
    };

    // dispatch relevant thunk action creator depending on form rendered
    let returnedItem; 
    if (isCreateItemForm) returnedItem = await dispatch(createItem(payload)); 
    else returnedItem = await dispatch(editItem(payload)); 

    // if successful, hide form. 
    if (returnedItem) hideForm();
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    hideForm();
  };

  return (
    <section className="edit-form-holder centered middled">
      <form className="item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={updateName}
        />
        <input
          type="number"
          placeholder="Happiness"
          min="0"
          max="100"
          required
          value={happiness}
          onChange={updateHappiness}
        />
        <input
          type="number"
          placeholder="Price"
          required
          value={price}
          onChange={updatePrice}
        />

        {
          // imageUrlInputElement is only rendered for create-new-item form. 
        isCreateItemForm ? imageUrlInputElement : ''
        } 

        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default ItemForm;
