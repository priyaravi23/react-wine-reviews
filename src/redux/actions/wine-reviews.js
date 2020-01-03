import {
    FETCH_WINE_REVIEWS,
    FETCH_WINE_REVIEWS_FAILURE,
    FETCH_WINE_REVIEWS_SUCCESS,
    SELECT_WINE_REVIEW
} from "../action-types";

import { WINE_REVIEWS_URL } from "../../utils/constants";

export const fetchWineReviewsStart = () => {
    return {
        type: FETCH_WINE_REVIEWS
    };
};

export const fetchWineReviewsSuccess = (reviews) => {
    return {
        type: FETCH_WINE_REVIEWS_SUCCESS,
        reviews
    };
};

export const fetchWineReviewsFailure = (err) => {
    return {
        type: FETCH_WINE_REVIEWS_FAILURE,
        err
    };
};

export const selectWineReview = (review) => {
    return {
        type: SELECT_WINE_REVIEW,
        review
    };
};

/**
 * @desc This is a redux action which is written using the Thunk format
 * */

export const fetchWineReviews = () => {
    return (dispatch, getState) => {
        dispatch(fetchWineReviewsStart());

        fetch(WINE_REVIEWS_URL)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        dispatch(fetchWineReviewsSuccess(data));
                    });
                } else {
                    dispatch(fetchWineReviewsFailure(response));
                }
            }, err => {
                dispatch(fetchWineReviewsFailure(err));
            }).catch(err => {
            dispatch(fetchWineReviewsFailure(err));
        });
    };
};
