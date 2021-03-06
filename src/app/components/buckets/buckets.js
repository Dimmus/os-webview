import {Controller} from 'superb';
import Bucket from './bucket/bucket';

const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

export default class Buckets extends Controller {

    init(data) {
        this.template = () => '';
        this.css = '/app/components/buckets/buckets.css';
        this.view = {
            classes: ['buckets-section']
        };
        this.model = data;
    }

    onLoaded() {
        for (const bucketData of this.model) {
            this.regions.self.append(new Bucket(bucketData));
        }
    }

}
