import BaseView from '~/helpers/backbone/view';
import BookInfoView from './book-info/book-info';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './adoption-form.hbs';

function sectionToggler(options) {
    let isOpen = false,
        toggleControl = options.toggleControl,
        toggleArea = options.toggleArea,
        openText = options.openText,
        closeText = options.closeText,
        region = options.region,
        updateToggleRegion = () => {
            if (isOpen) {
                let secondaryBookView = new BookInfoView('adoption_two');

                toggleControl.innerHTML = closeText;
                region.append(secondaryBookView);
                toggleArea.style.display = '';
            } else {
                toggleControl.innerHTML = openText;
                region.empty();
                toggleArea.style.display = 'none';
            }
        };

    return {
        toggle: () => {
            isOpen = !isOpen;
            updateToggleRegion();
        },
        update: updateToggleRegion
    };
}

@props({
    template: template,
    regions: {
        primaryBook: '#primary-book',
        secondaryBook: '#secondary-book'
    }
})
export default class AdoptionForm extends BaseView {

    @on('click .toggle-section')
    toggleSection() {
        event.preventDefault();
        this.toggler.toggle();
    }

    @on('submit form')
    failIfInvalid(event) {
        let invalid = this.el.querySelectorAll('.invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.el.classList.add('text-content');
        this.toggler = sectionToggler({
            toggleControl: this.el.querySelector('.toggle-section'),
            toggleArea: document.getElementById('secondary-book'),
            openText: '+ Add a second book',
            closeText: '- Remove the second book',
            region: this.regions.secondaryBook
        });
        let bookInfoView = new BookInfoView('adoption');

        this.regions.primaryBook.append(bookInfoView);
        this.toggler.update();
    }

}
