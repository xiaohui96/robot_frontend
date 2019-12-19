import React from 'react';
import WidgetInput from './Widgets/WidgetInput';
import WidgetSwitch from './Widgets/WidgetSwitch';
import WidgetSlider from './Widgets/WidgetSlider';
import WidgetLineChart from './Widgets/WidgetLineChart';
import WidgetPieChart from './Widgets/WidgetPieChart';
import WidgetGauge from './Widgets/WidgetGauge';
import WidgetThermometer from './Widgets/WidgetThermometer';
import Widget3DModel from './Widgets/Widget3DModel';
import WidgetCamera from './Widgets/WidgetCamera';
import WidgetWebCam from './Widgets/WidgetWebCam';
//语言
import intl from 'react-intl-universal';


export default function(key, params, onParamsConfig, monitor, signalParas,dataPool,plantInfo,isFullControl,pause,user) {
  return [
    {
      name: intl.get('number input'),
      iconid: "numberInput",
      widget: <WidgetInput monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} signalParaList={signalParas} dataPool={dataPool} plantInfo={plantInfo} isFullControl={isFullControl} />,
      defaultLayout: {w: 4, h: 2, x: 0, y: Infinity, minW: 2, minH: 2}
    },
    {
      name: intl.get('switch'),
      iconid: "switch",
      widget: <WidgetSwitch monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} />,
      defaultLayout: {w: 2, h: 2, x: 0, y: Infinity, minW: 2, minH: 2}
    },
    {
      name: intl.get('slider'),
      iconid: "sliders",
      widget: <WidgetSlider monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} signalParaList={signalParas} dataPool={dataPool} plantInfo={plantInfo} isFullControl={isFullControl}/>,
      defaultLayout: {w: 9, h: 2, x: 0, y: Infinity, minW: 8, minH: 2}
    },
    {
      name: intl.get('chart'),
      iconid: "lineChart",
      widget: <WidgetLineChart monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} signalParaList={signalParas} dataPool={dataPool} pause={pause} user={user}/>,
      defaultLayout: {w: 8, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    },
    {
      name: intl.get('pie chart'),
      iconid: "pieChart",
      widget: <WidgetPieChart monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig}/>,
      defaultLayout: {w: 6, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    },
    {
      name: intl.get('gauge'),
      iconid: "gauge",
      widget: <WidgetGauge monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} signalParaList={signalParas} dataPool={dataPool}/>,
      defaultLayout: {w: 6, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    },
    {
      name: intl.get('thermometer'),
      iconid: "thermometer",
      widget: <WidgetThermometer monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig}/>,
      defaultLayout: {w: 2, h: 8, x: 0, y: Infinity, minW: 2, minH: 6}
    },
    {
      name: intl.get('3DModel'),
      iconid: "3DModel",
      widget: <Widget3DModel monitor={monitor} keyValue={key} params={params} onParamsConfig={onParamsConfig} signalParaList={signalParas} dataPool={dataPool} plantInfo={plantInfo} isFullControl={isFullControl} />,
      defaultLayout: {w: 8, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    },
    {
      name: intl.get('camera'),
      iconid: "camera",
      widget: <WidgetCamera monitor={monitor} plantInfo={plantInfo} keyValue={key} params={params} onParamsConfig={onParamsConfig}/>,
      defaultLayout: {w: 8, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    },
    {
      name: intl.get('user webcam'),
      iconid: "account",
      widget: <WidgetWebCam monitor={monitor} />,
      defaultLayout: {w: 8, h: 6, x: 0, y: Infinity, minW: 6, minH: 6}
    }
  ];
}
