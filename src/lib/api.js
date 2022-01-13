import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from '../config'



function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

// * Recipe Request

export function getAllRecipes() {
  return axios.get(`${baseUrl}/recipes`)
}

export function getSingleRecipe(recipeId) {
  return axios.get(`${baseUrl}/recipes/${recipeId}`)
}

export function toggleFavourite(recipeId) {
  return axios.post(`${baseUrl}/recipes/${recipeId}`, recipeId, headers())
}

// * Profile Request

// make a function for getting profile information
export function getProfileInfo(userId) {
  console.log(userId)
  return axios.get(`${baseUrl}/profile/${userId}`)
}

// WRITE AN API CALL HERE - get request - check router.js in the backend to make sure you have the right route and args
// get request, getFavourites, the path is '/profile/:userId/favourites', pass the userId variable
export function getFavourites(userId) {
  console.log(userId)
  return axios.get(`${baseUrl}/profile/${userId}/favourites`, headers()) // added userId as an argument, add headers() here
}

// * Auth Requests

export function registerUser(formdata) {
  console.log(formdata) // test
  return axios.post(`${baseUrl}/register`, formdata)
}

export function loginUser(formdata) {
  // console log formdata here (test)
  return axios.post(`${baseUrl}/login`, formdata)
}
export function createRecipeComment(recipeId, formData) {
  return axios.post(`${baseUrl}/recipes/${recipeId}/comments`, formData, headers())
}
export function deleteRecipeComment(recipeId, commentId) {
  return axios.delete(`${baseUrl}/recipes/${recipeId}/comments/${commentId}`, headers())
}