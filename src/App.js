import React, {Component} from 'react';
import {filterReviews, postProcessReviews} from "./utils/postprocess-reviews";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            wineReviews: [],
            headings: null,
            reviews: null,
            err: null
        };

        this.handleInputFilterChange = this.handleInputFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    componentDidMount() {
        this.getWineReviews();
    }

    getWineReviews() {
        this.setState({
            ...this.state,
            isFetching: true
        });

        fetch('https://raw.githubusercontent.com/bindhyeswari/interview-prep/master/fixtures/sliced-wine-reviews.json?token=ABAZB7K4FZMNYMO3JIAFZIK6AKC54')
            .then(res => res.json())
            .then((data) => {
                const {headings, reviews} = postProcessReviews(data);

                this.setState({
                    isFetching: false,
                    wineReviews: data,
                    headings,
                    reviews,
                });
            })
            .catch((err) => {

                this.setState({
                    isFetching: false,
                    wineReviews: null,
                    reviews: null,
                    headings: null,
                    err: err
                });
            });
    }

    getHeadingsData() {
        const set = new Set();

        this.state.wineReviews.forEach(review => {
            Object.keys(review).forEach(prop => set.add(prop));
        });

        return [...set];
    }

    renderHeadings(headings) {
        const ths = Object.values(headings).map(heading => {
            return <th key={heading.prop}>
                <div>
                    <input
                        data-prop={heading.prop}
                        placeholder={heading.prop}
                        onChange={this.handleInputFilterChange}
                        type="text"/>
                </div>

                <div
                    data-prop={heading.prop}
                    onClick={this.handleSortChange}>
                    { heading.label.replace(/_/g, ' ') }
                </div>
            </th>
        });

        return <tr>
            { ths }
        </tr>
    }

    renderRows(reviewsArr) {
        return reviewsArr.map(reviews => {
            const tds = Object.entries(reviews).map(([prop, val]) => {
                return <td key={prop}>
                    {val}
                </td>
            });

            return <tr key={reviews.id}>
                { tds }
            </tr>
        })
    }

    sortBy(newReviewsArr, prop, asc) {
        // sort fn
        if (asc) {
            newReviewsArr.sort(this.compareFnAsc.bind(null, prop));
        } else {
            newReviewsArr.sort(this.compareFnDesc.bind(null, prop));
        }
        return newReviewsArr;
    }

    compareFnAsc(prop, a, b) {
        if (a[prop] > b[prop]) return 1;
        else if (a[prop] < b[prop]) return -1;
        else return 0;
    }

    compareFnDesc(prop, a, b) {
        if (a[prop] > b[prop]) return -1;
        else if (a[prop] < b[prop]) return 1;
        else return 0;
    }

    handleInputFilterChange(e) {
        const prop = e.target.dataset.prop;
        const value = e.target.value;
        const headings = this.state.headings;

        if (typeof value === "undefined") {
            return null;
        }

        this.setState({
            headings: {
                ...headings,
                [prop]: {
                    ...headings[prop],
                    filter: new RegExp(value, 'i')
                }
            }
        });
    }

    handleSortChange = e => {
        const headings = this.state.headings;
        const prop = e.target.dataset.prop;
        console.log(prop, headings[prop].sortState);

        const newReviewsArr = [...this.state.wineReviews];
        this.sortBy(newReviewsArr, prop, headings[prop].sortState);

        this.setState({
            headings: {
                ...headings,
                [prop]: {
                    ...headings[prop],
                    sortState: !headings[prop].sortState
                }
            }
        }, () => {
            console.log(this.state);
        });
    };

    render() {
        let filteredReviews;
        if (!this.state.reviews) {
            return null;
        } else {
            filteredReviews = filterReviews(this.state.reviews, this.state.headings);
        }

        return (
            <div>
                <table id='wineReviews'>
                    <thead>
                        {this.renderHeadings(this.state.headings)}
                    </thead>
                    <tbody>
                        {this.renderRows(filteredReviews)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;