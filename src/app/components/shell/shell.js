import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {props} from '~/helpers/backbone/decorators';
import header from './header/header';
import footer from './footer/footer';
import {template} from './shell.hbs';
import zendesk from '~/helpers/zendesk';

@props({
    el: 'body',
    template: template,
    regions: {
        main: '#main',
        header: '#header',
        footer: '#footer'
    }
})
class AppView extends BaseView {

    constructor() {
        super();

        this.header = header;
        this.footer = footer;

        this.render();
    }

    load(pageName, options) {
        let headTitle = document.querySelector('head title');

        // Lazy-load the page
        System.import(`~/pages/${pageName}/${pageName}`).then((m) => {
            let Page = m.default,
                view = new Page(options),
                hash = window.location.hash,
                scrollToDestination = () => {
                    let destination = document.getElementById(hash.substr(1));

                    if (destination) {
                        $.scrollTo(destination);
                    }
                };

            this.regions.header.show(header);
            this.regions.main.show(view);
            this.regions.footer.show(footer);
            headTitle.textContent = `${pageName[0].toUpperCase()}${pageName.slice(1)} - OpenStax`;
            zendesk();

            if (hash) {
                if ('isLoaded' in view) {
                    view.isLoaded.then(scrollToDestination);
                } else {
                    scrollToDestination();
                }
            } else {
                window.scrollTo(0, 0);
            }
        });

        return this;
    }
}

let appView = new AppView();

export default appView;
