import React, {Component} from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            // contains the json
            wineReviews: [],
            // contains the filtered wine-reviews
            filteredWineReviews: [],
            sortState: [],
            searchInput: ''
        }
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
                this.setState({
                        wineReviews: data,
                        filteredWineReviews: [...data],
                        isFetching: false
                    });

                console.log(this.state.wineReviews);
            })
            .catch((err) => {
              console.log(err);

              this.setState({
                  ...this.state,
                  isFetching: false
              });
            });
    }

    renderReviewsData() {
        let reviewsArr = [];

        this.state.wineReviews.forEach(review => {
            Object.values(review).forEach(prop => reviewsArr.push(prop));
        });

        return reviewsArr;
    }

    renderHeadingsData() {
        const set = new Set();

        this.state.wineReviews.forEach(review => {
            Object.keys(review).forEach(prop => set.add(prop));
        });

        return [...set];
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

    filterReviews(e) {
        const reviews = this.state.wineReviews;
        const headingEntries = Object.entries(this.renderHeadingsData());

        return reviews.filter(review => {
            return headingEntries.every(([prop, {filter}]) => {
                if (filter) {
                    return filter.test(review[prop])
                } else {
                    return true;
                }
            });
        });
    }

    render() {
        return (
            <div>
                <table id=''>
                    <thead>
                        <tr>
                            { Object.values(this.renderHeadingsData()).map((heading) => {
                                return <th>
                                    <input type="text" data-prop={heading} placeholder={heading} onChange={this.filterReviews()}/>
                                    <div data-prop={heading}>{ heading.replace(/_/g, ' ') } </div>
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.values(this.renderReviewsData()).map((item, index) => {
                                return <td>{ item }</td>
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
