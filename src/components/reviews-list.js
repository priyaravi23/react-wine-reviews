import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {object, string, func, bool} from 'prop-types';
import {filterAndSortReviews} from "../utils/postprocess-reviews";

class ReviewsList extends Component {
  static displayName = 'ReviewsList';
  static propTypes = {
    reviews: object,
    headings: object,
    fetchInProgress: bool,
    sortByHeading: string,
    handleInputFilterChange: func,
    handleSortChange: func
  };

  render() {
    const {reviews, headings, sortByHeading} = this.props;
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
      {this.props.fetchInProgress ? (<div>Fetch in progress!</div>) : (<table>
        <thead>
        {this.renderHeadings(headings)}
        </thead>
        <tbody>
        {this.renderRows(filteredReviews)}
        </tbody>
      </table>)}
    </div>);
  }

  renderHeadings = (headings) => {
    const ths = Object.values(headings).map(heading =>
      <th key={heading.prop}>
        <div>
          <input
            onChange={this.props.handleInputFilterChange}
            data-prop={heading.prop}
            type="text"/>
        </div>
        <div
          onClick={this.props.handleSortChange}
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
      tds[1] = (<td key={'title'}>
        <div>{review.title}</div>
        <Link class='text-link' to={`/reviews/${review.id}`}>View Details</Link>
      </td>);
      return (<tr key={review.id}>
        {tds}
      </tr>);
    });
  };
}

const mapStateToProps = reducerState => {
  const {reviews = {}, headings = {}, fetchInProgress = false} = reducerState || {};
  return {
    reviews,
    headings,
    fetchInProgress
  }
};

export default connect(mapStateToProps)(ReviewsList);
