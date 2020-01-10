import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {object, string, func, bool} from 'prop-types';
import {filterAndSortReviews} from "../utils/postprocess-reviews";
import get from 'lodash/get';

class ReviewsList extends Component {
  static displayName = 'ReviewsList';
  static propTypes = {
    reviews: object,
    headings: object,
    fetchInProgress: bool,
    sortByHeading: string
  };

  state = {
    headings: null
  };

  static getDerivedStateFromProps(props, state) {
    // console.log('Firing the method getDerivedStateFromProps', props, state);
    const headingsFromProps = props.headings;
    if (Object.keys(headingsFromProps).length > 0) {
      console.log('Setting headings in state from props');
      return {
        headings: headingsFromProps
      };
    }
  }

  render() {
    console.log('props headings', this.props.headings, 'state headings', this.state.headings);
    console.log('Firing the render() method of the ReviewsList');
    const {reviews, sortByHeading} = this.props;
    const {headings} = this.state;
    // create a table and render the reviews ...
    let filteredReviews;
    if (!reviews) {
      return null;
    } else {
      const isAscending = false; // Sort descending
      filteredReviews = filterAndSortReviews(reviews, headings, sortByHeading, isAscending);
      console.log(filteredReviews);
    }
    return (<div>
      <div className="my-component"> </div>
      {this.props.fetchInProgress ? (<div>Fetch in progress!</div>) : (<table>
        <thead>
        {this.renderHeadings(headings, sortByHeading)}
        </thead>
        <tbody>
        {this.renderRows(filteredReviews)}
        </tbody>
      </table>)}
    </div>);
  }

  renderHeadings = (headings = {}, sortByHeading) => {
    if (!headings) {
      return null;
    }
    let sortChar = '';
    if (sortByHeading && headings[sortByHeading]) {
      const {sortState} = headings[sortByHeading];
      console.log('Sort by', sortByHeading, ' and sort state is ', sortState);
      if (typeof sortState !== 'undefined') {
        sortChar = sortState ? '(asc)' : '(desc)';
      }
    }
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
          {heading.label} {heading.prop === sortByHeading ? sortChar : ''}
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
      tds[1] = (<td key={'title'}>
        <div>{review.title}</div>
        <Link class='text-link' to={`/reviews/${review.id}`}>View Details</Link>
      </td>);
      return (<tr key={review.id}>
        {tds}
      </tr>);
    });
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

const mapStateToProps = reducerState => {
  const {reviews = {}, headings = {}, fetchInProgress = false} = get(reducerState, 'wineReviews') || {};
  return {
    reviews,
    fetchInProgress,
    headings
  }
};

export default connect(mapStateToProps)(ReviewsList);
