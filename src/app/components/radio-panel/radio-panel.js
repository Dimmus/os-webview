import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './radio-panel.html';

export default class RadioPanel extends Controller {

    init(items, onChange) {
        this.template = template;
        this.view = {
            classes: ['filter-buttons']
        };
        this.model = {
            items,
            isSelected: (value) => this.selectedValue === value ? ' selected' : ''
        };
        this.active = false;
        this.onChange = onChange;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
    }

    updateSelected(value) {
        this.selectedValue = value;
        this.update();
    }

    @on('click')
    toggleActive() {
        this.active = !this.active;
        this.el.classList.toggle('active', this.active);
    }

    @on('click .filter-button')
    setCategory(event) {
        const newValue = event.target.dataset.value;

        if (newValue !== this.selectedValue) {
            this.active = false;
            this.el.classList.remove('active');
        }
        this.updateSelected(newValue);
        this.onChange(newValue);
    }

}
