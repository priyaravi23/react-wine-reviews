import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import get from 'lodash/get';
import history from '../history-utils';
import qs from 'qs';
import {object, bool, func} from 'prop-types';


// higher order component or a component wrapper
// const ModifiedReviewDetails = hoc(ReviewDetails)
class ReviewDetails extends Component {
  static displayName = 'ReviewDetails';
  static propTypes = {
    reviews: object,
    fetchInProgress: bool
  };

  render() {
    const id = get(this, 'props.match.params.id');
    const review = get(this, `props.reviews[${id}]`);
    console.log(review);
    console.log(qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }));
    return (
      <div>
        {this.props.fetchInProgress ? (<div>Fetch in progress</div>) : (<div>
          <Link class='text-link' to={'/reviews'}>Go back</Link>
          <h2>Review Details</h2>
          <pre>
          {review && this.renderProps(review)}
        </pre>
        </div>)}
      </div>
    );
  }

  renderProps = review => {
    const trs = Object.entries(review).map(([prop, value]) => {
      return (<tr key={prop}>
        <td>{prop}</td>
        <td>{value}</td>
      </tr>);
    });
    return (<table>
      <tbody>
      {trs}
      </tbody>
    </table>);
  };
}

/**
 * @desc Pull out the props from the reducer state that will be
 *   passed along as props to the component.
 * */
const mapStateToProps = reduxState => {
  console.log(reduxState);
  return {
    reviews: get(reduxState, 'wineReviews.reviews') || [],
    fetchInProgress: get(reduxState, 'wineReviews.fetchInProgress') || false,
  }
};

const WrappedReviewDetails = connect(mapStateToProps)(ReviewDetails);

export default WrappedReviewDetails;
