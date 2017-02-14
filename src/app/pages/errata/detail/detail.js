import {Controller} from 'superb';
import $ from '~/helpers/$';
import {bookPromise} from '~/models/book-titles';
import settings from 'settings';
import {description as template} from './detail.html';

export default class Detail extends Controller {

    static detailPromise(id) {
        return new Promise((resolve) => {
            fetch(`${settings.apiOrigin}/api/errata/${id}`)
                .then((r) => r.json())
                .then((detail) =>
                    bookPromise.then((bookList) => {
                        const entry = bookList.find((info) => info.id === detail.book);

                        detail.bookTitle = entry ? entry.title : '(unknown book ID)';
                        resolve(detail);
                    })
                );
        });
    }

    init(detail) {
        this.template = template;
        this.css = '/app/pages/errata/detail/detail.css';
        detail.date = new Date(detail.created).toLocaleDateString();
        detail.source = detail.resource;
        this.model = {
            detail,
            detailDataPairs: [
                ['Submission ID', 'id'], ['Title', 'bookTitle'], ['Source', 'source'],
                ['Error Type', 'error_type'], ['Location', 'location'],
                ['Description', 'detail'], ['Date Submitted', 'date']
            ],
            decisionDataPairs: [
                ['Decision', 'resolution'], ['Decision details', 'resolution_notes']
            ]
        };
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}