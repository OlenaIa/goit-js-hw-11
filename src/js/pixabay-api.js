import axios from 'axios';

const URL = "https://pixabay.com/api/";
const KEY = "37440122-e5d5a2493910548fa520b3add";

export async function fetchPhoto(q, page, perPage) {
    const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    const response = await axios.get(url);
    return response.data;          
};