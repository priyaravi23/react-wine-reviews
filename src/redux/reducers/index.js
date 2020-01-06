import {
  FETCH_WINE_REVIEWS,
  FETCH_WINE_REVIEWS_FAILURE,
  FETCH_WINE_REVIEWS_SUCCESS,
  SELECT_WINE_REVIEW
} from "../action-types";
import {postProcessReviews} from "../../utils/postprocess-reviews";

const DEFAULT_WINE_REVIEW_STATE = {
  reviews: {},
  fetchInProgress: false,
  err: null
};

/**
 * @function wineReviews
 * @desc Reducer: Given an initial state and an action object,
 *   it should generate a new state object based on
 *   the action, or return the existing state.
 * */

export function wineReviews(prevState = DEFAULT_WINE_REVIEW_STATE, action) {
  switch (action.type) {
    case FETCH_WINE_REVIEWS:
      return {
        ...DEFAULT_WINE_REVIEW_STATE,
        fetchInProgress: true,
        err: null
      };
    case FETCH_WINE_REVIEWS_SUCCESS:
      return {
        fetchInProgress: false,
        err: null,
        ...postProcessReviews(action.reviews)
      };
    case FETCH_WINE_REVIEWS_FAILURE:
      return {
        fetchInProgress: false,
        err: action.err,
        reviews: {},
      };
    case SELECT_WINE_REVIEW:
      return {
        ...prevState,
        reviews: action.reviews
      };
  }
}
