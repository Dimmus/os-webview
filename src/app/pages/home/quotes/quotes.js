import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './quotes.hbs';

@props({
    template: template
})
export default class Quotes extends BaseView {}
