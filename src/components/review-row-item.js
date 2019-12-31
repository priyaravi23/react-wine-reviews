import React from "react";

export const Review = (props) => {
    const {review} = props;
    return <div className={'review'}>
        {review.title}
    </div>
};