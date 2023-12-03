import {
    fetchBreeds,
    fetchCatByBreed,
    hideElement,
    showElement,
    showFetchError,
  } from './cat-api.js';
  import SlimSelect from 'slim-select';
  import 'slim-select/dist/slimselect.css';
  
  document.addEventListener('DOMContentLoaded', async function () {
    const selectEl = document.querySelector('.breed-select');
    const loaderEl = document.querySelector('.loader');
    const errorEl = document.querySelector('.error');
    const catInfoEl = document.querySelector('.cat-info');
  
    loaderEl.innerHTML = '';
    errorEl.innerHTML = '';
    
    try {
      let slimselect = new SlimSelect({
        select: selectEl,
        placeholder: 'Select a breed',
      });
      fetchBreeds().then(breeds => {
        showElement(loaderEl);
        const dataSlimSelect = [{ text: 'Select a breed', value: '' }];
        breeds.forEach(cat => {
          dataSlimSelect.push({ text: cat.name, value: cat.id });
        });
        slimselect.setData(dataSlimSelect);
        hideElement(loaderEl);
      });
      async function showBreed(selectedBreed) {
        showElement(loaderEl);
        catInfoEl.innerHTML = '';
        try {
          const cat = await fetchCatByBreed(selectedBreed);
          catInfoEl.innerHTML = `<img src="${cat.url}" alt="${cat.breeds[0].name}" width="600"/>
                  <div style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                      <h2 style="color: #333;">${cat.breeds[0].name}</h2>
                      <p style="color: #555;">${cat.breeds[0].description}</p>
                      <p style="color: #777;"><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
                  </div>`;
          hideElement(loaderEl);
          showElement(catInfoEl);
        } catch (error) {
          hideElement(loaderEl);
          showFetchError();
        }
      }
      selectEl.addEventListener('change', function () {
        const selectedBreed = selectEl.value;
        if (selectedBreed !== '' && selectedBreed !== 'Select a breed') {
          showBreed(selectedBreed);
        }
      });
    } catch (error) {
      hideElement(loaderEl);
      showFetchError();
    }
  });