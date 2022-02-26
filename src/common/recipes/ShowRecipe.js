import React from 'react'
import { useParams } from 'react-router-dom'
import { deleteRecipeComment, getSingleRecipe, toggleFavourite } from '../../lib/api' //getProfileInfo,
import Error from '../Error'
import Loading from '../Loading'
import RecipeCommentCard from './RecipeCommentCard'
import RecipeCommentForm from './RecipeCommentForm'
import { isAuthenticated } from '../../lib/auth'


function ShowRecipes(){
  const { recipeId } = useParams() //,userId
  const [recipe, setRecipe] = React.useState(null)
  const [isError, setIsError] = React.useState(null)
  const [hasFavourited, setHasFavourited] = React.useState(false)
  const [favouriteId, setFavouriteId] = React.useState(null)
  const isLoading = !recipe && !isError
  
  const fetchRecipe = React.useCallback(() => {
    const getData = async () => {
      try {
        const res = await getSingleRecipe(recipeId)
        setRecipe(res.data)
        // res.data.favouritedBy.map(favourite => {
        //   const ownerId = String(favourite._id)
        //   if (ownerId === profileId){

        //   }
        // })
      } catch (err) {
        setIsError(true)
      } 
    
    }
    getData()
  }, [recipeId])

  React.useEffect(() => {
    fetchRecipe()
  }, [recipeId, fetchRecipe])

  const handleFavouriteClick = async e => {
    e.preventDefault()
    try {
      const faveClick = await toggleFavourite(recipeId)
      const favouriteId = faveClick.data.favouritedBy.id
      setFavouriteId(favouriteId)
      console.log(faveClick.data.favouritedBy)
      setHasFavourited(!hasFavourited)
    } catch (err) {
      setIsError(true)
    }
  }
  

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Do you want to delete this comment?')) {
      try {
        await deleteRecipeComment(recipeId, commentId)
        fetchRecipe()
      } catch (err) {
        console.log(err)
      }
    }
  }
  
  return (
    <section>
      <div className="recipe-show-container">
        {isError && <Error />}
        {isLoading && <Loading />}
        {recipe && (
          <>
            <div className="recipe-card-container">
              <h2 className="recipe-card-title">
                {recipe.title}
              </h2>
              <div className="recipe-course-container">
                <p className="recipe-course">
                  {recipe.course}             
                </p>
              </div>
              <div className="recipe-card-image-container">
                <figure className="recipe-card-image">
                  <img src={recipe.image} alt={recipe.name} height={500} width= {700}/>
                </figure>  
                {hasFavourited ? 
                  <button className="faveBtn" onClick={handleFavouriteClick}>                
                    <i className="bi bi-bookmark-heart">Remove Favourites</i> 
                  </button>   
                  : 
                  <button className="faveBtn" onClick={handleFavouriteClick}>                
                    <i className="bi bi-bookmark-heart"> Add to Favourites</i>
                  </button>   
                }
                
                <div className="recipe-minutes-container">
                  <p><i className="bi bi-clock"></i><strong> Cook Time: </strong> {recipe.prepTime} Minutes </p>                 
                </div>       
              </div>
              <div className="recipe-macros-container">
                <div className="recipe-macros-title">
                  <h3>Nutrition</h3>
                </div>     
                <div className="recipe-macros">         
                  <p> <strong>Calories:</strong> {recipe.calories} kcal </p> 
                  <p><strong>Protein:</strong> {recipe.protein}g </p>
                  <p><strong> Carbs:</strong> {recipe.carbs}g </p>
                  <p><strong>Fats:</strong> {recipe.fats}g</p>
                </div>
              </div>
              <div className="recipe-ingredients-container">
                <div className="recipe-ingredients-title">
                  <h3>Ingredients</h3>   
                </div>
                <div className="recipe-ingredients">
                
                  <ul className="recipes-list">
                  
                    {recipe.ingredients.map((ingredient, index) => {
                      return  <li key={index}>{ingredient}</li>                                
                    })}   
                  </ul>   
                </div>                   
              </div>
              <div className="recipe-preparation-container">
                <div className="recipe-preparation-title">
                  <h3>Preparation</h3>
                </div>
                <div className="recipe-preparation">
                  <ul className="recipes-list">
                    {recipe.preparation.map((prepare, index) => {
                      return <li key={index}>{prepare}</li>
                    })}
                  </ul>
                </div>
              </div>
              <div className="column">
                {recipe.comments.map(comment => (
                  <RecipeCommentCard
                    key={comment._id}
                    text={comment.text}
                    addedBy={comment.addedBy}
                    handleDelete={() => handleDeleteComment(comment._id)}
                  />
                ))}
              </div>
              {isAuthenticated() && (
                <RecipeCommentForm
                  fetchRecipe={fetchRecipe}
                  recipeId={recipeId}
                />
              )}
            </div>
          </>
        )
        }
      </div>
    </section>
  )
}

export default ShowRecipes