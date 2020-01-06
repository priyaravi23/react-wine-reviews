import React, { Component } from 'react';
import {dispatchFetchWineReviews} from "./redux/actions/wine-reviews";
import { Switch, Route } from 'react-router-dom';

import './App.css';
import './index.css';
import ReviewsList from "./components/reviews-list";
import ReviewDetails from "./components/review-details";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortByHeading: 'title'
        };
        this.handleInputFilterChange = this.handleInputFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    componentDidMount() {
        // store.dispatch(fetchWineReviews());
      dispatchFetchWineReviews();
    }

    render() {
        return <div>
            {this.render1()}
        </div>

    };

    render1() {
        const {sortByHeading} = this.state;
        const reviewsListProps = {
            sortByHeading,
            handleInputFilterChange: this.handleInputFilterChange,
            handleSortChange: this.handleSortChange
        };

        // Similar approach that does not use the this.props.children approach
        // <Route path={'/reviews/:id'} component={() => <ReviewsList {...reviewsListProps}>}/>

        return (
            <div>
                <Switch>
                    <Route exact path={'/reviews'}>
                        <ReviewsList {...reviewsListProps}/>
                    </Route>
                    <Route exact path={'/reviews/:id'}
                           component={(props) => <ReviewDetails {...props}/>}/>
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
