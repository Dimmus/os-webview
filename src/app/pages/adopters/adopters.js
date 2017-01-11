import settings from '~/../settings';
import CMSPageController from '~/controllers/cms';import {description as template} from './adopters.html';

export default class Adopters extends CMSPageController {

    init() {
        this.template = template;
        this.css = '/app/pages/adopters/adopters.css';
        this.view = {
            classes: ['adopters-page', 'text-content']
        };
        this.model = {};
        this.slug = 'adopters';
    }

    onDataLoaded() {
        this.model.adopters = this.pageData.sort((a, b) => a.name.localeCompare(b.name));
        this.update();
    }

}
