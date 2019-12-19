import React, {Component} from 'react';

//语言国际化
import intl from 'react-intl-universal';
import http from "axios";
import _ from "lodash";
//import "../index/less/applang.css"
import qs from 'qs';

const languageType = qs.parse(window.location.search.slice(1)).lang;

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

class LangSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initDone: false
        };
        //由于事件函数onSelectLocale不是在render函数中定义的，所以需要通过bind绑定this指向。
        LangSetting.onSelectLocale = LangSetting.onSelectLocale.bind(this);
    }

    static loadLocales() {
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
                   console.log("App locale data", res.data);
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
                LangSetting.setState({initDone: true});
            });
    }

    static renderLocaleSelector = () => {
        return (<span className="langSel">
                <select onChange={LangSetting.onSelectLocale} className="language">
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

     static onSelectLocale(e) {
        //var ind =document.getElementsByClassName("language").selectedIndex;
        let lang = e.target.value;
        window.location.search = `?lang=${lang}`;
        //window.location.reload(true);
    }

}

export default LangSetting;