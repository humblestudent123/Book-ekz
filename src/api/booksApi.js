import axios from 'axios';

const API_URL = 'http://localhost:5000/books';

export const getBooks = () => axios.get(API_URL).then(res => res.data);
export const addBook = (book) => axios.post(API_URL, book).then(res => res.data);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data);