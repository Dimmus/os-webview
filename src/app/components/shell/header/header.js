import {Controller} from 'superb';
import stickyNote from '../sticky-note/sticky-note';
import settings from 'settings';
import {on} from '~/helpers/controller/decorators';
import linkHelper from '~/helpers/link';
import userModel from '~/models/usermodel';
import {description as template} from './header.html';

// FIX: This needs to be refactored into multiple views

class Header extends Controller {

    init() {
        this.template = template;
        this.css = '/app/components/shell/header/header.css';
        this.view = {
            tag: 'header',
            classes: ['page-header']
        };
        this.regions = {
            stickyNote: 'sticky-note'
        };

        this.meta = {};

        // Fix: There must be a better way
        const padParentForStickyNote = () => {
            const stickyNoteEl = this.el.querySelector('sticky-note');

            if (stickyNoteEl) {
                const h = stickyNoteEl.offsetHeight;

                this.el.parentNode.style.minHeight = `${h}px`;
            }
        };

        this.model = () => {
            const accounts = `${settings.apiOrigin}/accounts`;
            const currentPage = window.location.href;

            padParentForStickyNote();

            return {
                visible: () => this.meta.visible,
                fixed: () => this.meta.fixed,
                transparent: () => this.meta.transparent,
                login: `${accounts}/login/openstax/?next=${currentPage}`,
                logout: `${accounts}/logout/?next=${currentPage}`,
                user: this.user || {
                    username: null,
                    groups: []
                },
                accountLink: settings.accountHref
            };
        };

        userModel.load().then((user) => {
            if (typeof user === 'object') {
                this.user = user;
            }
            this.update();
        });

        document.addEventListener('click', this.resetHeader.bind(this));
        window.addEventListener('resize', this.closeFullScreenNav.bind(this));
        window.addEventListener('resize', padParentForStickyNote);
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(this.updateHeaderStyle.bind(this));
        });
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(this.removeAllOpenClasses.bind(this));
        });

        this.handlePathChange = () => {
            if (window.location.pathname === '/give/form') {
                localStorage.visitedGive = Date.now();
            } else if (window.location.pathname === '/') {
                localStorage.visitedGive = Number(localStorage.visitedGive || 0) + 1;
            }
            this.update();
        };
        window.addEventListener('popstate', this.handlePathChange);
        // Custom event created by router, because it does not emit popstate
        // for forward navigation on IE or Safari
        window.addEventListener('navigate', this.handlePathChange);
    }

    onUpdate() {
        const path = window.location.pathname;
        const visitedGive = Number(localStorage.visitedGive || 0) > 10;
        const hideSticky = (path !== '/' || visitedGive);

        this.el.querySelector('sticky-note').classList.toggle('hidden', hideSticky);
    }

    onLoaded() {
        this.regions.stickyNote.append(stickyNote);
    }

    classList(action, ...args) {
        let result = null;

        if (this.el && typeof this.el.classList === 'object') {
            result = this.el.classList[action](...args);
        }

        return result;
    }

    visible() {
        this.meta.visible = true;
        this.classList('add', 'visible');
        return this;
    }

    pin() {
        this.meta.fixed = true;
        this.classList('add', 'fixed');
        return this;
    }

    transparent() {
        this.meta.transparent = true;
        this.classList('add', 'transparent');
        return this;
    }

    reset() {
        this.meta.visible = false;
        this.meta.pinned = false;
        this.meta.transparent = false;
        this.classList('remove', 'visible');
        this.classList('remove', 'fixed');
        this.classList('remove', 'transparent');
        return this;
    }

    isVisible() {
        return !!this.classList('contains', 'visible');
    }

    isPinned() {
        return !!this.classList('contains', 'fixed');
    }

    isTransparent() {
        return !!this.classList('contains', 'transparent');
    }

    get height() {
        let height = 0;

        if (this.el && typeof this.el === 'object') {
            height = this.el.offsetHeight;
        }

        return height;
    }

    get metaNavHeight() {
        const metaNav = this.el.querySelector('.meta-nav');
        let height = 0;

        if (metaNav && typeof metaNav === 'object') {
            height = metaNav.offsetHeight;
        }

        return height;
    }

    @on('click .skiptocontent a')
    skipToContent() {
        const el = document.getElementById('maincontent');

        function removeTabIndex() {
            this.removeAttribute('tabindex');
            this.removeEventListener('blur', removeTabIndex, false);
            this.removeEventListener('focusout', removeTabIndex, false);
        }

        if (el) {
            if (!(/^(?:a|select|input|button|textarea)$/i).test(el.tagName)) {
                el.tabIndex = -1;
                el.addEventListener('blur', removeTabIndex, false);
                el.addEventListener('focusout', removeTabIndex, false);
            }

            el.focus();
        }
    }

    toggleFullScreenNav(e) {
        const button = e.currentTarget;

        document.body.classList.toggle('no-scroll');

        window.requestAnimationFrame(() => {
            this.el.classList.toggle('active');
            this.removeAllOpenClasses(e);
            this.removeCloneDropdownParent();

            button.classList.toggle('expanded');
            button.setAttribute('aria-expanded', !!button.classList.contains('expanded'));
        });
    }

    removeClass(array, className) {
        const len = array.length;

        for (let i = 0; i < len; i++) {
            if (array[i].classList) {
                array[i].classList.remove(className);
            } else {
                const names = array[i].className.split(' ');
                const sublen = names.length;

                for (let j = 0; j < sublen; j++) {
                    if (names[j] === className) {
                        names[j] = '';
                    }
                }
                array[i].className = names.join('');
            }
        }
    }

    removeAllOpenClasses() {
        const parentItem = this.el.querySelectorAll('.dropdown');
        const dropDownMenu = this.el.querySelectorAll('.dropdown-menu');

        if (this.el) {
            this.el.classList.remove('open');
        }
        this.removeClass(parentItem, 'open');
        this.removeClass(dropDownMenu, 'open');
        this.closeDropdownMenus(true);
        this.updateHeaderStyle();
    }

    closeFullScreenNav() {
        const button = this.el.querySelector('.expand');

        if (this.el.classList.contains('active')) {
            document.body.classList.remove('no-scroll');
        }

        window.requestAnimationFrame(() => {
            this.el.classList.remove('active');
            this.removeAllOpenClasses();
            this.removeCloneDropdownParent();

            button.classList.remove('expanded');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    @on('click .expand')
    onClickToggleFullScreenNav(e) {
        e.stopPropagation();
        this.toggleFullScreenNav(e);
    }

    @on('click .page-header .dropdown > a')
    flyOutMenu(e) {
        const w = window.innerWidth;
        const $this = e.target;
        const parentItem = $this.parentNode;
        const dropDownMenu = $this.nextElementSibling;

        if (w <= 768) {
            e.preventDefault();
            e.stopPropagation();
            this.cloneDropdownParent(e);

            if (!dropDownMenu.classList.contains('open')) {
                this.removeAllOpenClasses();
                this.el.classList.add('open');
                parentItem.classList.add('open');
                dropDownMenu.classList.add('open');
                this.openThisDropdown(e);
            } else if (!e.target.classList.contains('back')) {
                this.closeFullScreenNav(e);
            }
        }
    }

    @on('keydown .expand')
    onKeydownToggleFullScreenNav(e) {
        if (document.activeElement === e.currentTarget && (e.keyCode === 13 || e.keyCode === 32)) {
            e.preventDefault();
            this.toggleFullScreenNav(e);
        }
    }

    openThisDropdown(e) {
        const menu = e.target.nextElementSibling;

        menu.setAttribute('aria-expanded', 'true');

        for (const a of menu.querySelectorAll('a')) {
            a.setAttribute('tabindex', '0');
        }
    }

    resetHeader(e) {
        const urlClick = e && linkHelper.validUrlClick(e);

        if (urlClick) {
            if (!urlClick.parentNode.classList.contains('dropdown')) {
                this.closeDropdownMenus(true);
                this.closeFullScreenNav();
            }
        } else if (!this.el.classList.contains('active')) {
            this.closeFullScreenNav();
        } else {
            this.updateHeaderStyle();
        }
    }

    closeDropdownMenus(all) {
        const menus = this.el.querySelectorAll('.dropdown-menu');

        for (const menu of menus) {
            if (all || !menu.contains(document.activeElement)) {
                menu.setAttribute('aria-expanded', 'false');

                for (const a of menu.querySelectorAll('a')) {
                    a.setAttribute('tabindex', '-1');
                }
            }
        }
    }

    updateHeaderStyle() {
        const height = this.height;

        if (window.pageYOffset > height && !this.isPinned()) {
            this.reset().pin().visible();
        } else if (window.pageYOffset <= height) {
            if (window.location.pathname === '/') {
                this.reset().transparent();
            } else {
                this.reset();
            }
        }
    }

    cloneDropdownParent(e) {
        const $this = e.target;
        const dropdown = $this.nextElementSibling;
        const parent = $this.cloneNode(true);
        const thisLi = document.createElement('li');
        const back = document.createElement('a');
        const element = dropdown.querySelector('.clone');

        thisLi.setAttribute('role', 'presentation');
        thisLi.setAttribute('class', 'clone');

        parent.removeAttribute('href');
        parent.removeAttribute('aria-haspopup');
        back.setAttribute('class', 'back');
        back.text = 'Back';
        thisLi.appendChild(back);
        thisLi.appendChild(parent);

        if (!element) {
            back.addEventListener('click', this.removeAllOpenClasses.bind(this), true);

            dropdown.insertBefore(thisLi, dropdown.childNodes[0]);
        }
    }

    removeCloneDropdownParent() {
        const clone = this.el.querySelectorAll('.clone');

        for (const thisClone of clone) {
            const back = thisClone.querySelector('.back');

            back.removeEventListener('click', this.removeAllOpenClasses.bind(this), true);
            thisClone.parentNode.removeChild(thisClone);
        }
    }

}

const header = new Header();

export default header;
