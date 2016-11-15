import SalesforceForm from '~/controllers/salesforce-form';
import router from '~/router';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import selectHandler from '~/handlers/select';
import {sfUserModel} from '~/models/usermodel';
import salesforceModel from '~/models/salesforce';
import {description as template} from './faculty-verification.html';

export default class FacultyVerificationForm extends SalesforceForm {

    testInstitutionalEmail() {
        const institutionalEmailInput = this.el.querySelector('[name="00NU0000005oVQV"]');
        const isValid = $.testInstitutionalEmail(institutionalEmailInput);

        institutionalEmailInput.setCustomValidity(isValid ? '' : 'We cannot verify a generic email address');
        return isValid;
    }

    init() {
        super.init();
        this.template = template;
        this.css = '/app/pages/faculty-verification/faculty-verification.css';
        this.view = {
            classes: ['faculty-verification-form']
        };

        this.model = {
            adoptionOptions: salesforceModel.adoption(['adopted', 'recommended', 'no']),
            validationMessage: (name) => this.hasBeenSubmitted ?
                this.el.querySelector(`[name="${name}"]`).validationMessage :
                ''
        };
    }

    onLoaded() {
        document.title = 'Instructor Verification - OpenStax';
        this.sfUserModelLoaded = sfUserModel.load();
        this.sfUserModelLoaded.then((user) => {
            if (user.username) {
                this.model.firstName = user.first_name;
                this.model.lastName = user.last_name;
                this.model.userId = user.username;
                this.model.accountId = user.accounts_id;
                this.model.pendingVerification = user.pending_verification;
                this.model.alreadyVerified = user.groups.includes('Faculty');

                if (user.accounts_id === null) {
                    this.model.problemMessage = 'Could not load user information';
                } else {
                    this.model.problemMessage = '';
                }
            } else {
                const loginLink = document.querySelector('.nav-menu-item.login > a');

                loginLink.click();
            }
            this.formResponseEl = this.el.querySelector('#form-response');
            this.goToConfirmation = () => {
                if (this.submitted) {
                    this.submitted = false;
                    router.navigate('/confirmation?faculty');
                }
            };
            this.formResponseEl.addEventListener('load', this.goToConfirmation);
        });
    }

    onDataLoaded() {
        super.onDataLoaded();
        this.model.titles = this.salesforceTitles;
        this.sfUserModelLoaded.then(() => {
            this.update();
            selectHandler.setup(this);
        });
    }

    @on('change [name="00NU0000005oVQV"]')
    checkEmailPending(event) {
        const sfResponse = sfUserModel.load({email: event.target.value});

        sfResponse.then((user) => {
            this.model.pendingVerification = user.salesforce_email_previously_used;
            this.update();
        });
    }

}
