import React, {Component} from 'react';
import {filterAndSortReviews, postProcessReviews} from "./utils/postprocess-reviews";
import PickReviewsComponent from './pick-reviews.component'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            wineReviews: [],
            headings: null,
            reviews: null,
            err: null,
            sortByHeading: 'title' // Default sort by title
        };

        // React uses 'use strict' by default

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

        fetch('https://raw.githubusercontent.com/bindhyeswari/interview-prep/master/fixtures/sliced-wine-reviews.json?token=ABAZB7JXUU44365BZ4GB5UK6BZ3AS')
            .then(res => res.json())
            .then((data) => {
                const {headings, reviews} = postProcessReviews(data);
                console.log(typeof postProcessReviews(data).reviews);

                this.setState({
                    isFetching: false,
                    wineReviews: data,
                    headings,
                    reviews,
                    err: null
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

                if (prop === 'title') {
                    return <td key={prop}>
                        {val + ''}

                        <Router>
                            <Link className= 'text-link' to={"/details/" + reviews.id}>
                                <div>View Details</div>
                            </Link>

                            <Switch>
                                <Route path={"/details/" + reviews.id}>
                                    <PickReviewsComponent />
                                </Route>
                            </Switch>

                        </Router>
                    </td>
                } else {
                    return <td key={prop}>
                        {val}
                    </td>
                }
            });

            return <tr key={reviews.id}>
                { tds }
            </tr>
        })
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

    handleSortChange(e) {
        const headings = this.state.headings;
        const prop = e.target.dataset.prop;
        console.log(prop, headings[prop].sortState);

        this.setState({
            headings: {
                ...headings,
                [prop]: {
                    ...headings[prop],
                    sortState: !headings[prop].sortState
                }
            },
            sortByHeading: prop
        }, () => {
            console.log(this.state);
        });
    };

    render() {
        let filteredReviews;
        if (!this.state.reviews) {
            return null;
        } else {
            const isAscending = false; // Sort descending
            filteredReviews = filterAndSortReviews(this.state.reviews, this.state.headings, this.state.sortByHeading, isAscending);
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