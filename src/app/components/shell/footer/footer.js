import regeneratorRuntime from 'regenerator-runtime/runtime';
import {Controller} from 'superb';
import settings from '~/../settings';
import {description as template} from './footer.html';

class Footer extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/footer/footer.css';
        this.view = {
            tag: 'footer',
            classes: ['page-footer']
        };
        this.model = {};
        /* eslint arrow-parens: 0 */
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/documents?search=press%20kit`);
                const data = await response.json();

                if (data.length) {
                    this.model.pressKitData = data[0];
                    this.update();
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }

}

const footer = new Footer();

export default footer;
