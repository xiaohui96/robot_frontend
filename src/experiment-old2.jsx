//依赖类
import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';
import {Router, Route, Switch} from 'react-router-dom';
import {withRouter} from 'react-router'
import {LocaleProvider, Spin, Icon} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import history from 'utils/history';
import PropTypes from "prop-types";
import {
    mxGraph,
    mxParallelEdgeLayout,
    mxConstants,
    mxEdgeStyle,
    mxLayoutManager,
    mxCell,
    mxGeometry,
    mxRubberband,
    mxDragSource,
    mxKeyHandler,
    mxCodec,
    mxClient,
    mxConnectionHandler,
    mxUtils,
    mxToolbar,
    mxEvent,
    mxImage,
    mxFastOrganicLayout,
    mxGraphHandler,
    mxGuide,
    mxEdgeHandler,
    mxEditor,
    mxPerimeter,
    mxRectangle,
    mxPoint
} from "mxgraph-js";


//数据流
import ExperimentActions from 'actions/ExperimentActions';
import AppActions from 'actions/AppActions';
import experimentStore from 'stores/experimentStore';

//组件类
import WidgetButton from 'components/WidgetButton';
import WIDGETS from 'components/WidgetsList';

//样式类
import './experiment.less';


class Experiment extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state = {

        };


    }

    componentDidMount(){
        this.LoadGraph();
    }

    configureStylesheet=(graph)=>
    {
        var style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_GRADIENTCOLOR] = '#41B9F5';
        style[mxConstants.STYLE_FILLCOLOR] = '#8CCDF5';
        style[mxConstants.STYLE_STROKECOLOR] = '#1B78C8';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_OPACITY] = '80';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 0;
        style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
        style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
        graph.getStylesheet().putDefaultVertexStyle(style);

        // NOTE: Alternative vertex style for non-HTML labels should be as
        // follows. This repaces the above style for HTML labels.
        /*var style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_SPACING_TOP] = '56';
        style[mxConstants.STYLE_GRADIENTCOLOR] = '#7d85df';
        style[mxConstants.STYLE_STROKECOLOR] = '#5d65df';
        style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
        style[mxConstants.STYLE_FONTCOLOR] = '#1d258f';
        style[mxConstants.STYLE_FONTFAMILY] = 'Verdana';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = '1';
        style[mxConstants.STYLE_ROUNDED] = '1';
        style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
        style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
        style[mxConstants.STYLE_OPACITY] = '80';
        graph.getStylesheet().putDefaultVertexStyle(style);*/

        style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#FF9103';
        style[mxConstants.STYLE_GRADIENTCOLOR] = '#F8C48B';
        style[mxConstants.STYLE_STROKECOLOR] = '#E86A00';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_OPACITY] = '80';
        style[mxConstants.STYLE_STARTSIZE] = '30';
        style[mxConstants.STYLE_FONTSIZE] = '16';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        graph.getStylesheet().putCellStyle('group', style);

        style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
        style[mxConstants.STYLE_FONTCOLOR] = '#774400';
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTSIZE] = '10';
        style[mxConstants.STYLE_FONTSTYLE] = 2;
        style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
        style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
        graph.getStylesheet().putCellStyle('port', style);

        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
        style[mxConstants.STYLE_STROKEWIDTH] = '2';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
    }

    addSidebarIcon=(graph, sidebar, label, image)=>
    {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        var funct = function(graph, evt, cell, x, y)
        {
            var parent = graph.getDefaultParent();
            var model = graph.getModel();

            var v1 = null;

            model.beginUpdate();
            try
            {
                // NOTE: For non-HTML labels the image must be displayed via the style
                // rather than the label markup, so use 'image=' + image for the style.
                // as follows: v1 = graph.insertVertex(parent, null, label,
                // pt.x, pt.y, 120, 120, 'image=' + image);
                v1 = graph.insertVertex(parent, null, label, x, y, 120, 120);
                v1.setConnectable(false);

                // Presets the collapsed size
                v1.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);

                // Adds the ports at various relative locations
                var port = graph.insertVertex(v1, null, 'Trigger', 0, 0.25, 16, 16,
                    'port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
                port.geometry.offset = new mxPoint(-6, -8);

                var port = graph.insertVertex(v1, null, 'Input', 0, 0.75, 16, 16,
                    'port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18', true);
                port.geometry.offset = new mxPoint(-6, -4);

                var port = graph.insertVertex(v1, null, 'Error', 1, 0.25, 16, 16,
                    'port;image=editors/images/overlays/error.png;spacingLeft=18', true);
                port.geometry.offset = new mxPoint(-8, -8);

                var port = graph.insertVertex(v1, null, 'Result', 1, 0.75, 16, 16,
                    'port;image=editors/images/overlays/information.png;spacingLeft=18', true);
                port.geometry.offset = new mxPoint(-8, -4);
            }
            finally
            {
                model.endUpdate();
            }

            graph.setSelectionCell(v1);
        }

        // Creates the image which is used as the sidebar icon (drag source)
        var img = document.createElement('img');
        img.setAttribute('src', image);
        img.style.width = '48px';
        img.style.height = '48px';
        img.title = 'Drag this to the diagram to create a new vertex';
        sidebar.appendChild(img);

        var dragElt = document.createElement('div');
        dragElt.style.border = 'dashed black 1px';
        dragElt.style.width = '120px';
        dragElt.style.height = '120px';

        // Creates the image which is used as the drag icon (preview)
        var ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
        ds.setGuidesEnabled(true);
    };

    LoadGraph=()=> {
        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            // Assigns some global constants for general behaviour, eg. minimum
            // size (in pixels) of the active region for triggering creation of
            // new connections, the portion (100%) of the cell area to be used
            // for triggering new connections, as well as some fading options for
            // windows and the rubberband selection.
            mxConstants.MIN_HOTSPOT_SIZE = 16;
            mxConstants.DEFAULT_HOTSPOT = 1;

            // Enables guides
            mxGraphHandler.prototype.guidesEnabled = true;

            // Alt disables guides
            mxGuide.prototype.isEnabledForEvent = function(evt)
            {
                return !mxEvent.isAltDown(evt);
            };

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

            // Workaround for Internet Explorer ignoring certain CSS directives
            if (mxClient.IS_QUIRKS)
            {
                document.body.style.overflow = 'hidden';
                new mxDivResizer(container);
                new mxDivResizer(outline);
                new mxDivResizer(toolbar);
                new mxDivResizer(sidebar);
                new mxDivResizer(status);
            }

            // Creates a wrapper editor with a graph inside the given container.
            // The editor is used to create certain functionality for the
            // graph, such as the rubberband selection, but most parts
            // of the UI are custom in this example.
            var editor = new mxEditor();
            var graph = editor.graph;
            var model = graph.getModel();

            // Disable highlight of cells when dragging from toolbar
            graph.setDropEnabled(false);

            // Uses the port icon while connections are previewed
            graph.connectionHandler.getConnectImage = function(state)
            {
                return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
            };

            // Centers the port icon on the target port
            graph.connectionHandler.targetConnectImage = true;

            // Does not allow dangling edges
            graph.setAllowDanglingEdges(false);

            // Sets the graph container and configures the editor
            editor.setGraphContainer(ReactDom.findDOMNode(this.mount));
            var config = mxUtils.load(
                'editors/config/keyhandler-commons.xml').
            getDocumentElement();
            editor.configure(config);

            // Defines the default group to be used for grouping. The
            // default group is a field in the mxEditor instance that
            // is supposed to be a cell which is cloned for new cells.
            // The groupBorderSize is used to define the spacing between
            // the children of a group and the group bounds.
            var group = new mxCell('Group', new mxGeometry(), 'group');
            group.setVertex(true);
            group.setConnectable(false);
            editor.defaultGroup = group;
            editor.groupBorderSize = 20;

            // Disables drag-and-drop into non-swimlanes.
            graph.isValidDropTarget = function(cell, cells, evt)
            {
                return this.isSwimlane(cell);
            };

            // Disables drilling into non-swimlanes.
            graph.isValidRoot = function(cell)
            {
                return this.isValidDropTarget(cell);
            }

            // Does not allow selection of locked cells
            graph.isCellSelectable = function(cell)
            {
                return !this.isCellLocked(cell);
            };

            // Returns a shorter label if the cell is collapsed and no
            // label for expanded groups
            graph.getLabel = function(cell)
            {
                var tmp = mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"

                if (this.isCellLocked(cell))
                {
                    // Returns an empty label but makes sure an HTML
                    // element is created for the label (for event
                    // processing wrt the parent label)
                    return '';
                }
                else if (this.isCellCollapsed(cell))
                {
                    var index = tmp.indexOf('</h1>');

                    if (index > 0)
                    {
                        tmp = tmp.substring(0, index+5);
                    }
                }

                return tmp;
            }

            // Disables HTML labels for swimlanes to avoid conflict
            // for the event processing on the child cells. HTML
            // labels consume events before underlying cells get the
            // chance to process those events.
            //
            // NOTE: Use of HTML labels is only recommended if the specific
            // features of such labels are required, such as special label
            // styles or interactive form fields. Otherwise non-HTML labels
            // should be used by not overidding the following function.
            // See also: configureStylesheet.
            graph.isHtmlLabel = function(cell)
            {
                return !this.isSwimlane(cell);
            }

            // To disable the folding icon, use the following code:
            /*graph.isCellFoldable = function(cell)
            {
                return false;
            }*/

            // Shows a "modal" window when double clicking a vertex.
            graph.dblClick = function(evt, cell)
            {
                // Do not fire a DOUBLE_CLICK event here as mxEditor will
                // consume the event and start the in-place editor.
                if (this.isEnabled() &&
                    !mxEvent.isConsumed(evt) &&
                    cell != null &&
                    this.isCellEditable(cell))
                {
                    if (this.model.isEdge(cell) ||
                        !this.isHtmlLabel(cell))
                    {
                        this.startEditingAtCell(cell);
                    }
                    else
                    {
                        var content = document.createElement('div');
                        content.innerHTML = this.convertValueToString(cell);
                        showModalWindow(this, 'Properties', content, 400, 300);
                    }
                }

                // Disables any default behaviour for the double click
                mxEvent.consume(evt);
            };

            // Enables new connections
            graph.setConnectable(true);

            // Adds all required styles to the graph (see below)
            this.configureStylesheet(graph);

            // Adds sidebar icons.
            //
            // NOTE: For non-HTML labels a simple string as the third argument
            // and the alternative style as shown in configureStylesheet should
            // be used. For example, the first call to addSidebar icon would
            // be as follows:
            // addSidebarIcon(graph, sidebar, 'Website', 'images/icons48/earth.png');
            this.addSidebarIcon(graph, ReactDom.findDOMNode(this.sidebar),
                '<h1 style="margin:0px;">Website</h1><br>'+
                '<img src="images/icons48/earth.png" width="48" height="48">'+
                '<br>'+
                '<a href="http://www.jgraph.com" target="_blank">Browse</a>',
                'images/icons48/earth.png');


        }
    }



    render() {
        return (
            <>
            <div className="widget-list">

                <WidgetButton text="导入" iconid="upload"/>
                <WidgetButton text="导出" iconid="download"/>

            </div>



            <div
                ref={(sidebar) => {
                    this.sidebar = sidebar;
                }}
                style={{position: 'absolute',overflow: 'hidden',top:'36px',left:'0px',bottom:'36px',maxWidth:'52px', width:'56px',paddingTop:'10px',paddingLeft:'4px'}}

            />

            <div
                className="three-js-container"
                ref={(mount) => {
                    this.mount = mount;
                }}
            />
            </>
        )
    }
}

Experiment = withRouter(Experiment);

ReactDom.render(
    <LocaleProvider locale={zhCN}>
        <Router history={history}>
            <Experiment/>
        </Router>
    </LocaleProvider>
    , document.querySelector("#root"));
