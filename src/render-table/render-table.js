import React, {Component} from 'react';
import {filterAndSortReviews, postProcessReviews} from "./utils/postprocess-reviews";

const Review = (props) => {
    const {review} = props;
    return <div className={'review'}>
        {review.title}
    </div>
};

class App extends Component {
    static displayName = 'App';
    static propTypes = {};

    state = {
        // STORE MODEL DATA IN OBJECTS, NOT ARRAYS
        inProgress: false,
        reviews: null, // object that has each review id mapped specifically
        err: null,
        headings: null,
        sortByHeading: 'title' // Default sort by title
    };

    async componentDidMount() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/bindhyeswari/interview-prep/master/fixtures/sliced-wine-reviews.json?token=ABAZB7JXUU44365BZ4GB5UK6BZ3AS');
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
        const {inProgress} = this.state;
        return (
            <div>
                {inProgress && <div>Fetching reviews ... </div>}
                {this.renderReviews()}
            </div>
        );
    }

    renderReviews = () => {
        const {reviews, headings, sortByHeading} = this.state;
        // create a table and render the reviews ...
        let filteredReviews;
        if (!reviews) {
            return null;
        } else {
            const isAscending = false; // Sort descending
            filteredReviews = filterAndSortReviews(reviews, headings, sortByHeading, isAscending);
            console.log(filteredReviews);
        }
        return (<table>
            <thead>
            {this.renderHeadings(headings)}
            </thead>
            <tbody>
            {this.renderRows(filteredReviews)}
            </tbody>
        </table>);
    };

    renderHeadings = (headings) => {
        const ths = Object.values(headings).map(heading =>
            <th key={heading.prop}>
                <div>
                    <input
                        onChange={this.handleInputFilterChange}
                        data-prop={heading.prop}
                        type="text"/>
                </div>
                <div
                    onClick={this.handleSortChange}
                    data-prop={heading.prop}>
                    {heading.label}
                </div>
            </th>);
        return (<tr>
            {ths}
        </tr>);
    };

    renderRows = (reviewsArr) => {
        // create a row element for every review and return
        return reviewsArr.map(review => {
            // return a td element for every value
            const tds = Object.entries(review)
                .map(([prop, value]) => <td key={prop}>{value}</td>);
            return (<tr key={review.id}>
                {tds}
            </tr>);
        });
    };

    handleInputFilterChange = e => {
        // const prop = e.target.dataset.prop;
        // const value = e.target.value
        const {dataset: {prop}, value} = e.target;
        const {headings} = this.state;
        console.log(prop, value);
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
    };
    handleSortChange = e => {
        const {headings} = this.state;
        const {dataset: {prop}} = e.target;
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