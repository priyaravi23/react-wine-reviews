import React, { Component } from 'react';
import {dispatchFetchWineReviews} from "./redux/actions/wine-reviews";
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import './index.css';
import ReviewsList from "./components/reviews-list";
import ReviewDetails from "./components/review-details";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortByHeading: 'title'
        };
    }

    componentDidMount() {
        // store.dispatch(fetchWineReviews());
      dispatchFetchWineReviews();
    }

    render() {
        return <div>
            <div className="my-component"> </div>
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
}

export default App;
