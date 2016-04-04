import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import Headshot from './headshot/headshot';
import {props} from '~/helpers/backbone/decorators';
import {template} from './about-us.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import bios from './bios.js';

function toHeadshot(bioEntry) {
    return {
        name: bioEntry.name,
        url: bioEntry.image ? `/images/about-us/${bioEntry.image}` : null,
        title: bioEntry.title,
        description: bioEntry.bio,
        bgColor: bioEntry.bgColor,
        textColor: bioEntry.textColor
    };
}

function lastName(bioEntry) {
    return bioEntry.name.substr(1 + bioEntry.name.lastIndexOf(' ')).toLowerCase();
}

@props({
    template,
    templateHelpers: {strips},
    regions: {
        team: '.our-team>.headshots',
        advisors: '.strategic-advisors>.headshots'
    }
})
export default class AboutUs extends BaseView {
    onRender() {
        let stateModel = new BaseModel();

        this.el.classList.add('about-us-page', 'text-content');
        for (let person of bios.team.sort((a, b) => lastName(a) > lastName(b) ? 1 : -1)) {
            this.regions.team.append(new Headshot(toHeadshot(person), stateModel));
        }
        for (let person of bios.advisors.sort((a, b) => lastName(a) > lastName(b) ? 1 : -1)) {
            this.regions.advisors.append(new Headshot(toHeadshot(person)));
        }
    }
}
