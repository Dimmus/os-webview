import BaseView from '~/helpers/backbone/view';
import PageModel from '~/models/pagemodel';
import Author from './author/author';
import Resource from './resource/resource';
import {props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

function dataToTemplateHelper(data) {
    let quotes = data.book_quotes[0],
        result = {
            title: data.title,
            description: data.description,
            endorsement: quotes.quote_text,
            attribution: quotes.quote_author,
            attributionSchool: quotes.quote_author_school,
            topAuthors: data.book_contributing_authors.filter((entry) => entry.display_at_top),
            allAuthors: data.book_contributing_authors
        };

    result.coverUrl = data.cover_url ||
    `https://placeholdit.imgix.net/~text?txtsize=33&txt=${data.title}&w=220&h=220`;

    return result;
}

@props({
    template: template,
    regions: {
        getThisTitle: '.floating-menu .get-this-book',
        topAuthors: '#top-authors',
        allAuthors: '#all-authors',
        instructorResources: '#instructor-resources',
        studentResources: '#student-resources'
    }
})
export default class Details extends BaseView {
    constructor() {
        super(...arguments);
        this.templateHelpers = {};
    }

    onRender() {
        let slug = decodeURIComponent(window.location.search.substr(1)),
            pageModel = new PageModel(),
            insertResources = (resources, regionName) => {
                for (let res of resources) {
                    if (res.link_document) {
                        this.regions[regionName].append(new Resource(res));
                    }
                }
            };

        if (slug === '') {
            slug = window.location.pathname.replace(/.*\//, '');
        }

        pageModel.fetch({
            data: {type: 'books.Book', slug}
        }).then((data) => {
            let detailUrl = data.pages[0].meta.detail_url,
                detailModel = new PageModel();

            detailModel.fetch({url: detailUrl}).then((detailData) => {
                let th = dataToTemplateHelper(detailData);

                for (let topAuthor of th.topAuthors) {
                    this.regions.topAuthors.append(new Author(topAuthor));
                }
                for (let author of th.allAuthors) {
                    this.regions.allAuthors.append(new Author(author));
                }
                this.el.querySelector('.book-cover').src = th.coverUrl;
                this.el.querySelector('.book-info .title').textContent = th.title;
                this.el.querySelector('.book-info .blurb').innerHTML = th.description;
                document.getElementById('endorsement').innerHTML = th.endorsement;
                document.getElementById('attribution').textContent = th.attribution;
                document.getElementById('attribution-school').textContent = th.attributionSchool;
                this.gtt = new GetThisTitle(detailData);
                this.regions.getThisTitle.show(this.gtt);

                insertResources(detailData.book_faculty_resources, 'instructorResources');
                insertResources(detailData.book_student_resources, 'studentResources');
            });
        });
    }
}
