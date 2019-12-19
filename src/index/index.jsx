import React from 'react';
import ReactDOM from 'react-dom';
import enquire from 'enquire.js';
import {scrollScreen} from 'rc-scroll-anim';

import Nav from './Nav';
import Banner from './Banner';
import Footer from './Footer';

//语言国际化
import intl from 'react-intl-universal';
import http from "axios";
import _ from "lodash";
import "../index/less/nav.css"
import qs from 'qs';

import './less/antMotion_style.less';
import LangConsistent from "routes/LangConsistent";

const languageType = qs.parse(window.location.search.slice(1)).lang;


// LangConsistent();

const SUPPOER_LOCALES = [
    {
        name: '简体中文',
        value: 'zh-CN'
    },
    {
        name: 'English',
        value: 'en-US'
    }
];


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectLocale = this.onSelectLocale.bind(this);
        this.state = {
            isMode: false,
            initDone: false

        };
    }

    componentDidMount() {
        // 适配手机屏幕;
        this.enquireScreen((isMode) => {
            this.setState({isMode});
        });
        LangConsistent();
        this.loadLocales();


    }

    enquireScreen = (cb) => {
        // console.log("cb:",cb);
        /* eslint-disable no-unused-expressions */
        enquire.register('only screen and (min-width: 320px) and (max-width: 767px)', {
            match: () => {
                cb && cb(true);
            },
            unmatch: () => {
                cb && cb();
            },
        });
        /* eslint-enable no-unused-expressions */
    }

    loadLocales() {
        let currentLocale = intl.determineLocale({
            urlLocaleKey: "lang",
            cookieLocaleKey: "lang"
        });
        if (!_.find(SUPPOER_LOCALES, {value: currentLocale})) {
            currentLocale = "zh-CN";
        }

        http
            .get(`../locales/${currentLocale}.json`)//"../index/less/nav.css"
            .then(res => {
                //   console.log("App locale data", res.data);
                // init method will load CLDR locale data according to currentLocale
                return intl.init({
                    currentLocale,
                    locales: {
                        [currentLocale]: res.data
                    }
                });
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({initDone: true});
            });
    }

    renderLocaleSelector = () => {
        return (<span className="langSel">
                <select onChange={this.onSelectLocale} className="language">
                    {SUPPOER_LOCALES.map(locale => {
                        //selected选中的永远为URL中的languageType，返回此option
                        if (locale.value === languageType) {
                            return <option key={locale.value} value={locale.value}
                                           selected="selected">{locale.name}</option>
                        }
                        //返回其他option
                        return <option key={locale.value} value={locale.value}>{locale.name}</option>;
                    })}
                </select>
            </span>
        );
    }

    onSelectLocale(e) {
        //var ind =document.getElementsByClassName("language").selectedIndex;
        let lang = e.target.value;
        window.location.search = `?lang=${lang}`;
        //window.location.reload(true);
    }


    render() {
        return (
            // this.state.initDone &&
            <div className="templates-wrapper">
                <Nav id="nav_0_0" key="nav_0_0" renderLocaleSelector={this.renderLocaleSelector}
                     isMode={this.state.isMode}/>
                <Banner id="content_1_0" key="content_1_0" isMode={this.state.isMode}/>
                <Footer id="footer_0_0" key="footer_0_0" isMode={this.state.isMode}/>
            </div>
        );
    }
}

ReactDOM.render(<Home/>, document.querySelector("#root"))
