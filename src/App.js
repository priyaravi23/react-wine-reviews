import React, {Component} from 'react';
import {object, string, func} from 'prop-types';
import {Switch, Route} from 'react-router-dom';
import {filterAndSortReviews, postProcessReviews} from "./utils/postprocess-reviews";

import './App.css';
import './index.css';
import ReviewsList from "./components/reviews-list";
import ReviewDetails from "./components/review-details";

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

    async componentDidMount() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/bindhyeswari/interview-prep/master/fixtures/sliced-wine-reviews.json?token=ABAZB7MHZJOYQXN2PFHMQYK6DC3UU');
            const data = await response.json();
            const {headings, reviews} = postProcessReviews(data);
            console.log(headings, reviews[0]);
            this.setState({
                inProgress: false,
                err: null,
                headings,
                reviews
            });
        } catch (ex) {
            console.log('Error ');
            this.setState({
                inProgress: false,
                reviews: null,
                headings: null,
                err: ex
            });
        }
    }

    render() {
        return <div>
            {this.render1()}
        </div>

    };

    render1() {
        const {inProgress} = this.state;

        const {reviews, headings, sortByHeading, selectedReview} = this.state;
        const reviewsListProps = {
            reviews,
            headings,
            sortByHeading,
            handleInputFilterChange: this.handleInputFilterChange,
            handleSortChange: this.handleSortChange
        };

        const reviewDetailProps = {
            reviews: reviews
        };

        // Similar approach that does not use the this.props.children approach
        // <Route path={'/reviews/:id'} component={() => <ReviewsList {...reviewsListProps}>}/>

        return (
            <div>
                {inProgress && <div>Fetching reviews ... </div>}
                <Switch>
                    <Route exact path={'/reviews'}>
                        <ReviewsList {...reviewsListProps}/>
                    </Route>
                    <Route exact path={'/reviews/:id'}
                           component={(props) => <ReviewDetails {...reviewDetailProps} {...props}/>}/>
                    <Route path={'/'} component={() => <div>Default Page</div>}/>
                </Switch>
            </div>
        );
    }

    renderReviews = () => {
        const {reviews, headings, sortByHeading} = this.state;
        const props = {
            reviews,
            headings,
            sortByHeading,
            handleInputFilterChange: this.handleInputFilterChange,
            handleSortChange: this.handleSortChange
        };
        return (<ReviewsList {...props}/>);
    };

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
}

export default App;