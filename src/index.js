import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const ref = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
};
const { searchForm, gallery, btnLoadMore } = ref;

const paramsForNotify = {
    position: 'center-center',
    timeout: 4000,
    width: '400px',
    fontSize: '24px'
};

const URL = "https://pixabay.com/api/";
const KEY = "37440122-e5d5a2493910548fa520b3add";
const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');

searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    const { searchQuery } = event.currentTarget.elements;
    keyOfSearchPhoto = searchQuery.value
        .trim()
        .toLowerCase()
        .split(' ')
        .join('+');
    console.log(keyOfSearchPhoto);

    fetchPhoto(keyOfSearchPhoto, page)
        .then(data => {
            Notify.info(`Hooray! We found ${data.totalHits} images.`, paramsForNotify);
            const searchResults = data.hits;
            if (searchResults.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.', paramsForNotify);
            };
            console.log(searchResults);
            createMarkup(searchResults);    
        })
        .catch(onFetchError);
    
    btnLoadMore.classList.remove('is-hidden');
    btnLoadMore.addEventListener('click', onClickLoadMore);

    event.currentTarget.reset();
};

function onClickLoadMore() {
    page += 1;
    fetchPhoto(keyOfSearchPhoto, page)
        .then(data => {
            const numberOfPage = Math.ceil(data.totalHits / perPage);
            const searchResults = data.hits;
            console.log(searchResults);
            createMarkup(searchResults);
            if (page === numberOfPage) {
                btnLoadMore.classList.add('is-hidden');
                Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
            };
        })
        .catch(onFetchError);
}

function createMarkup(searchResults) {
    const arrPhotos = searchResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <div class="img_wrap">
            <a class="gallery_link" href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        </div>
        <div class="info">
            <p class="info-item">
            <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
            <b>Views: ${views}</b>
            </p>
            <p class="info-item">
            <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads: ${downloads}</b>
            </p>
        </div>
        </div>`
    });
    gallery.insertAdjacentHTML("beforeend", arrPhotos.join(''));
    new SimpleLightbox('.gallery a', { 
                captionsData: 'alt',
                captionDelay: 250,
    });
};

async function fetchPhoto(q, page) {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;
    // const response = await fetch(`${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
    // if (!response.ok) {
    //     throw new Error(response.status);
    // }
    // return response.json();             
};

function onFetchError() {
    Notify.failure('Oops! Something went wrong! Try reloading the page or make another choice!', paramsForNotify);
};
