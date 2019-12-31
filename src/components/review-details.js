import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import get from 'lodash/get';
import history from '../history-utils';
import qs from 'qs';
import {object, string, func} from 'prop-types';

class ReviewDetails extends Component {
    static displayName = 'ReviewDetails';
    static propTypes = {
        reviews: object
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
                <Link class='text-link' to={'/reviews'}>Go back</Link>
                <h2>Review Details</h2>
                <pre>
          {review && this.renderProps(review)}
        </pre>
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

export default ReviewDetails;