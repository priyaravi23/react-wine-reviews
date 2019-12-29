import React, {Component} from 'react';
import {postProcessReviews} from "./utils/postprocess-reviews";

class PickReviewsComponent extends Component {
    static propTypes = {};

    state = {
        inProgress: false,
        reviews: null,
        err: null,
        headings: null,
    };

    async componentDidMount() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/bindhyeswari/interview-prep/master/fixtures/sliced-wine-reviews.json?token=ABAZB7JXUU44365BZ4GB5UK6BZ3AS');
            const data = await response.json();
            const {headings, reviews} = postProcessReviews(data);
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

    handleRedirect(){
        // TODO: similar to browserhistory ?
    }

    render() {
        const {inProgress} = this.state;
        return (
            <div>
                {inProgress && <div>Fetching reviews ... </div>}
                {this.renderIndividualReviews()}

                <button className="primary" onClick={this.handleRedirect.bind(this)}>Back</button>
            </div>
        );
    }
}

export default PickReviewsComponent;
