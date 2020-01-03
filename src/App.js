import React, { Component } from 'react';
import store from './redux/store';
import { fetchWineReviews } from "./redux/actions/wine-reviews";
import { Switch, Route } from 'react-router-dom';
import { postProcessReviews } from "./utils/postprocess-reviews";

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

    componentDidMount() {
        console.log('Registered listener on store.');
        store.subscribe((...args) => {
            console.log('Seems like the store\'s state has changed');
            const {fetchInProgress, reviews: _reviews, err} = store.getState();
            const {headings, reviews} = postProcessReviews(_reviews);
            this.setState({
                inProgress: fetchInProgress,
                reviews,
                err,
                headings
            });
        });

        // fetch wine reviews etc
        store.dispatch(fetchWineReviews());
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