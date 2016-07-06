import LoadingView from '~/helpers/backbone/loading-view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './impact.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const highlightedPartners = [{
    name: 'Auburn University',
    url: 'http://www.auburn.edu',
    logo: '/images/impact/partners/auburn.png'
}, {
    name: 'BCcampus',
    url: 'https://bccampus.ca',
    logo: '/images/impact/partners/bccampus.png'
}, {
    name: 'Central New Mexico Community College',
    url: 'http://www.cnm.edu',
    logo: '/images/impact/partners/cnm.png'
}, {
    name: 'Grand Rapids Community College',
    url: 'http://www.grcc.edu',
    logo: '/images/impact/partners/grcc.png'
}, {
    name: 'Maricopa Community Colleges',
    url: 'https://www.maricopa.edu',
    logo: '/images/impact/partners/maricopa.png'
}, {
    name: 'Ohio State University',
    url: 'https://www.osu.edu',
    logo: '/images/impact/partners/osu.png'
}, {
    name: 'Salt Lake Community College',
    url: 'http://www.slcc.edu',
    logo: '/images/impact/partners/slcc.png'
}, {
    name: 'Tarrant County College',
    url: 'https://www.tccd.edu',
    logo: '/images/impact/partners/tarrant.png'
}, {
    name: 'UMass Amherst',
    url: 'http://www.umass.edu',
    logo: '/images/impact/partners/umass.png'
}, {
    name: 'University of Idaho',
    url: 'https://www.uidaho.edu',
    logo: '/images/impact/partners/idaho.png'
}, {
    name: 'University of Georgia',
    url: 'http://www.uga.edu',
    logo: '/images/impact/partners/georgia.png'
}, {
    name: 'University of Oklahoma',
    url: 'https://www.ou.edu',
    logo: '/images/impact/partners/oklahoma.png'
}, {
    name: 'University of Texas at San Antonio',
    url: 'http://utsa.edu',
    logo: '/images/impact/partners/utsa.png'
}, {
    name: 'Board of Regents of the University System of Georgia',
    url: 'http://www.usg.edu',
    logo: '/images/impact/partners/ugsystem.png'
}, {
    name: 'Virginia Tech',
    url: 'https://www.vt.edu',
    logo: '/images/impact/partners/vt.png'
}];

@props({
    template: template,
    css: '/app/pages/impact/impact.css',
    templateHelpers: {
        strips,
        highlightedPartners
    }
})
export default class Impact extends LoadingView {

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e, {doHistory: false});
    }

    static metaDescription = () => `Since 2012, OpenStax has saved students millions through
        free, peer-reviewed college textbooks. Meet the students and 3,000+ schools who’ve
        adopted OpenStax.`;

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.hidden').classList.remove('hidden');
    }

}
