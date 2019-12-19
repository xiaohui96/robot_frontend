//import React, { Component } from 'react';
import qs from 'qs';

const language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
const languageType = qs.parse(window.location.search.slice(1)).lang;
//console.log("language = " + language);
//console.log("Type = " + languageType);


function LangConsistent() {
    // console.log('This is language test!')
        // if (languageType == undefined || (languageType =='en-US'&& qs.parse(window.location.search.slice(1)).lang!='en-US' )) {}
    if (language !== 'zh-CN') {
        if (qs.parse(window.location.search.slice(1)).lang ===undefined && languageType!=='zh-CN') {
            // if (languageType !== 'zh-CN')
            window.location.search = `?lang=en-US`;
            // window.location.href = document.referrer;
            // console.log(document.referrer);
            // // if (languageType === 'en-US')
            // //     window.location.search = `?lang=en-US`;
            // // else window.location.search = `?lang=zh-CN`;
            // // console.log(window.location.href);
        }
         else if(qs.parse(window.location.search.slice(1)).lang===undefined && languageType==='zh-CN')
         {
             window.location.search = '?lang=zh-CN';
         }
    }
    else {
        //qs.parse(window.location.search.slice(1)).lang!=='en-US'&&qs.parse(window.location.search.slice(1)).lang !== 'zh-CN'
        if (qs.parse(window.location.search.slice(1)).lang===undefined && languageType!=='en-US') {//languageType == undefined
            window.location.search = '?lang=zh-CN';
        }
        else if(qs.parse(window.location.search.slice(1)).lang===undefined && languageType==='en-US')
        {
            window.location.search = '?lang=en-US';
        }
    }
}

export default LangConsistent;