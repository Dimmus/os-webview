import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './loading-section.hbs';

@props({template})
export default class LoadingSection extends BaseView {
    onRender() {
        this.el.classList.add('os-loader');
    }
}