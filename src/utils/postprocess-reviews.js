import uuid from 'uuid';
export const postProcessReviews = reviews => {
    const obj = {};
    const set = new Set();
    // map unique ids to each review
    reviews.forEach(review => {
        const id = uuid.v4(); // use the v4 for random uuids
        review.id = id;
        obj[id] = review;
        Object.keys(review).forEach(key => set.add(key));
    });
    // return an object with a key value mapping for the review
    return {
        reviews: obj,
        headings: [...set].reduce((obj, heading) => {
            obj[heading] = {
                label: heading.replace(/_/g, ' '),
                prop: heading,
                sortState: undefined,
                filter: null
            };
            return obj;
        }, {})
    };
};

export const filterReviews = (reviews, headings) => {
    const props = Object.keys(headings);
    return Object.values(reviews).filter(review => {
        return props.every(prop => headings[prop].filter ?
            headings[prop].filter.test(review[prop]) : true);
    });
};