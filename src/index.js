import { Notify } from 'notiflix/build/notiflix-notify-aio';

const ref = {
    searchForm: document.querySelector('.search-form'),
    btn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
};
const { searchForm, btn, gallery } = ref;

searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
    event.preventDefault();
    const { searchQuery } = event.currentTarget.elements;
    const keyOfSearchPhoto = searchQuery.value
        .trim()
        .toLowerCase()
        .split(' ')
        .join('+');
    console.log(keyOfSearchPhoto);

    fetchPhoto(keyOfSearchPhoto)
    .then(data => {
        console.log(data.hits);
        const hits = data.hits;
    })
    .catch(onFetchError);
    
    event.currentTarget.reset();
}

const URL = "https://pixabay.com/api/";
const KEY = "37440122-e5d5a2493910548fa520b3add";

function fetchPhoto(q) {
    return fetch(`${URL}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });       
};

function onFetchError() {
    Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', {
        position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'
    });
};
