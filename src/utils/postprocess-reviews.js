import uuid from 'uuid';
import get from 'lodash/get';

export const postProcessReviews = reviews => {
    const obj = {};
    const set = new Set();
    // map unique ids to each review
    reviews.forEach((review, index) => {
        const id = index; //uuid.v4(); // use the v4 for random uuids
        review.id = id;
        review.points = +review.points;
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

export const generateCompareFn = (asc, prop) => {
    if (asc) {
        return (a, b) => {
            if (a[prop] < b[prop]) return -1;
            else if (a[prop] > b[prop]) return 1;
            else return 0;
        }
    } else {
        return (a, b) => {
            if (a[prop] < b[prop]) return 1;
            else if (a[prop] > b[prop]) return -1;
            else return 0;
        }
    }
};

export const filterAndSortReviews = (reviews, headings, sortByProp) => {
    const props = Object.keys(headings);
    const _sortState = get(headings, `${sortByProp}.sortState`);
    const sortState = typeof _sortState === 'undefined' ? true : _sortState;

    const filtered = Object.values(reviews).filter(review => {
        return props.every(prop => headings[prop].filter ?
            headings[prop].filter.test(review[prop]) : true);
    });

    const compareFn = generateCompareFn(sortState, sortByProp);

    return filtered.sort(compareFn);
};