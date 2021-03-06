import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import userModel from '~/models/usermodel';
import router from '~/router';
import {highSchoolSlugs} from '~/models/book-titles';
import {description as template} from './get-this-title.html';

export default class GetThisTitle extends Controller {

    init(data) {
        this.template = template;
        this.css = '/app/components/get-this-title/get-this-title.css';
        this.regions = {
            submenu: '.submenu'
        };

        const isHighSchool = highSchoolSlugs.includes(data.slug);
        const printLink = [data.amazon_link, data.amazon_coming_soon, data.bookstore_link,
            data.bookstore_coming_soon, isHighSchool].find((x) => x);

        this.model = {
            ibookLink: data.ibook_link,
            ibookLink2: data.ibook_link_volume_2,
            webviewLink: data.webview_link,
            comingSoon: data.coming_soon,
            conceptCoachLink: data.concept_coach_link,
            bookshareLink: data.bookshare_link,
            pdfLink: (data.high_resolution_pdf_url || data.low_resolution_pdf_url),
            printLink,
            isHighSchool,
            submenu: '',
            hiRes: data.high_resolution_pdf_url,
            loRes: data.low_resolution_pdf_url,
            amazon: {
                link: data.amazon_link,
                comingSoon: data.amazon_coming_soon,
                price: data.amazon_price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }),
                blurb: data.amazon_blurb
            },
            bookstore: {
                link: data.bookstore_link,
                comingSoon: data.bookstore_coming_soon,
                blurb: data.bookstore_blurb
            },
            slug: data.slug
        };
    }

    @on('click .btn')
    blurAfterClick(event) {
        event.target.blur();
    }

    @on('click .show-pdf-submenu')
    showPdfSubmenu(event) {
        event.preventDefault();
        this.model.submenu = 'pdf';
        this.update();
    }

    @on('click .show-print-submenu')
    showPrintSubment(event) {
        event.preventDefault();
        this.model.submenu = 'print';
        this.update();
    }

    @on('click .submenu .remover')
    hideSubmenu() {
        this.model.submenu = '';
        this.update();
    }

    @on('click [href*="cnx.org/content"],:not(.show-pdf-submenu)[href$=".pdf"]')
    showGive() {
        userModel.load().then((userInfo) => {
            if (!userInfo.is_superuser && !userInfo.is_staff) {
                router.navigate('/give?student', {path: '/give?student'});
            }
        });
    }

}
