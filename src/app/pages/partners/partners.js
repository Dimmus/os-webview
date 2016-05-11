import LoadingView from '~/helpers/backbone/loading-view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import FilterButton from '~/components/filter-button/filter-button';
import Icon from './icon/icon';
import Partner from './partner/partner';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './partners.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import router from '~/router';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'],
    filterButtons = ['View All', ...categories];

let partnersData = {},
    partnersDataPromise, pageDataPromise;


function handlePartnersData(data) {
    for (let page of data.pages) {
        let name = page.heading;

        data.pages.sort((a, b) => a.name < b.name ? a : b);

        partnersData[name] = {
            name,
            blurb: page.long_description,
            subjects: page.ally_subject_list,
            bookLinks: [],
            isAp: page.is_ap,
            logoUrl: page.ally_bw_logo
        };
        if (page.ally_logo) {
            partnersData[name].logoUrl = page.ally_logo;
        }
    }
}

pageDataPromise = new PageModel().fetch({
    data: {
        type: 'pages.EcosystemAllies',
        fields: ['title', 'classroom_text']
    }
});

partnersDataPromise = new PageModel().fetch({
    data: {
        type: 'allies.Ally',
        fields: ['ally_subject_list', 'title', 'short_description', 'long_description',
                'heading', 'is_ap', 'ally_bw_logo']
    }
}).then(handlePartnersData);

class FilterStateModel extends BaseModel {
    matchesFilter(partnerData) {
        let subject = this.get('selectedFilter');

        return (subject === 'View All' ||
            (subject === 'AP®' && partnerData.isAp) ||
            partnerData.subjects.indexOf(subject) >= 0);
    }
}

@props({
    template: template,
    css: '/app/pages/partners/partners.css',
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        icons: '.icons .container',
        blurbs: '.blurbs.container'
    }
})
export default class Partners extends LoadingView {
    @on('click .filter')
    filterClick() {
        let filterSection = this.el.querySelector('.filter');

        $.scrollTo(filterSection, 60, 30);
    }

    updateSelectedFilterFromPath() {
        let pathMatch = window.location.pathname.match(/\/partners\/(.+)/),
            selectedFilter = 'View All';

        if (pathMatch) {
            let subject = FilterButton.canonicalSubject(pathMatch[1]);

            for (let c of categories) {
                if (FilterButton.canonicalSubject(c) === subject) {
                    selectedFilter = c;
                }
            }
            if (selectedFilter === 'View All') {
                router.navigate('404', true);
            }
        }
        this.stateModel.set('selectedFilter', selectedFilter);
    }

    constructor() {
        super();
        this.stateModel = new FilterStateModel({
            selectedFilter: 'View All',
            selectedBook: null
        });
        this.updateSelectedFilterFromPath();
    }

    handlePageData(data) {
        this.el.querySelector('#page-title').textContent = data.pages[0].title;
        this.el.querySelector('#page-subhead').innerHTML = data.pages[0].classroom_text;
    }

    onRender() {
        this.el.classList.add('partners-page');
        for (let button of filterButtons) {
            this.regions.filterButtons.append(new FilterButton(button, this.stateModel));
        }
        this.otherPromises.push(new Promise((resolve) => {
            partnersDataPromise.then(() => {
                for (let name of Object.keys(partnersData).sort()) {
                    this.regions.icons.append(new Icon(partnersData[name], this.stateModel));
                    this.regions.blurbs.append(new Partner(partnersData[name], this.stateModel));
                }
                resolve();
            });
        }));
        pageDataPromise.then(this.handlePageData.bind(this));
        super.onRender();
    }

    onLoaded() {
        super.onLoaded();
        for (let section of this.el.querySelectorAll('.hero,.icons')) {
            section.classList.remove('hidden');
        }
    }
}