/* *
 *
 * Author: Pawel Lysy
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Annotations';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import ControllablePath from './ControllablePath.js';
import U from '../../../Core/Utilities.js';
import BBoxObject from '../../../Core/Renderer/BBoxObject';
import MockPointOptions from '../MockPointOptions';
import AxisType from '../../../Core/Axis/AxisType';
const { merge, defined } = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * A controllable ellipse class.
 *
 * @requires modules/annotations
 *
 * @private
 * @class
 * @name Highcharts.AnnotationControllableEllipse
 *
 * @param {Highcharts.Annotation} annotation an annotation instance
 * @param {Highcharts.AnnotationsShapeOptions} options a shape's options
 * @param {number} index of the Ellipse
 */
interface EllipseShapeOptions extends Highcharts.AnnotationsShapeOptions {
    yAxis: number;
    xAxis: number;
    ry: number;
    rx: number;
    angle: number;
    referencePoints: Array<ReferencePointsOptions>;
}
interface ReferencePointsOptions {
    x: number;
    y: number;
}
class ControllableEllipse implements ControllableMixin.Type {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A map object which allows to map options attributes to element
     * attributes.
     *
     * @name Highcharts.AnnotationControllableEllipse.attrsMap
     * @type {Highcharts.Dictionary<string>}
     */
    public static attrsMap = merge(ControllablePath.attrsMap, {
        ry: 'ry'
    });

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        annotation: Annotation,
        options: EllipseShapeOptions,
        index: number
    ) {
        this.init(annotation, options, index);
        this.collection = 'shapes';
    }

    /* *
     *
     *  Properties
     *
     * */

    public addControlPoints = ControllableMixin.addControlPoints;
    public anchor = ControllableMixin.anchor;
    public attr = ControllableMixin.attr;
    public attrsFromOptions = ControllableMixin.attrsFromOptions;
    public destroy = ControllableMixin.destroy;
    public getPointsOptions = ControllableMixin.getPointsOptions;
    public linkPoints = ControllableMixin.linkPoints;
    public point = ControllableMixin.point;
    public scale = ControllableMixin.scale;
    public setControlPointsVisibility = ControllableMixin.setControlPointsVisibility;
    public shouldBeDrawn = ControllableMixin.shouldBeDrawn;
    public transform = ControllableMixin.transform;
    public translatePoint = ControllableMixin.translatePoint;
    public transformPoint = ControllableMixin.transformPoint;
    public update(
        this: ControllableEllipse,
        newOptions: Highcharts.AnnotationControllableOptionsObject
    ): void {
        const options = merge(true, this.options, newOptions);
        this.options = options;
        this.redraw();
    }

    public referencePoints: Array<ReferencePointsOptions> = void 0 as any;

    /**
     * @type 'ellipse'
     */
    public type = 'ellipse';

    /* *
     *
     *  Functions
     *
     * *

    /**
     * Transform the middle point (center of an ellipse).
     * Mostly used to handle dragging of the ellipse.
     */

    public init(
        annotation: Annotation,
        options: EllipseShapeOptions,
        index: number
    ): void {
        if (defined(options.yAxis)) {
            (options.points as MockPointOptions[]).forEach((point): void => {
                point.yAxis = options.yAxis;
            });
        }
        if (defined(options.xAxis)) {
            (options.points as MockPointOptions[]).forEach((point): void => {
                point.xAxis = options.xAxis;
            });
        }
        ControllableMixin.init.call(this, annotation, options, index);
    }

    /**
     *
     * Render the element
     * @param parent parent SVG element.
     */

    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options),
            graphic = this.annotation.chart.renderer.createElement('ellipse');
        graphic.attr(attrs).add(parent);
        this.graphic = graphic;
        ControllableMixin.render.call(this);
    }

    public translate(this: ControllableEllipse, dx: number, dy: number): void {
        ControllableMixin.translateShape.call(this, dx, dy, true);

    }

    public getAttrs(position: BBoxObject, position2: BBoxObject): any {
        const x1 = position.x,
            y1 = position.y,
            x2 = position2.x,
            y2 = position2.y;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.sqrt(((x1 - x2) * (x1 - x2)) / 4 + ((y1 - y2) * (y1 - y2)) / 4);
        const tan = (y2 - y1) / (x2 - x1);
        let angle = (Math.atan(tan) * 180) / Math.PI;

        if (cx < x1) {
            angle += 180;
        }
        const ry = this.getRY();

        return { cx, cy, rx, ry, angle };
    }

    public getRY(): number {
        const yAxis = this.getYAxis();
        return Math.abs(yAxis.toPixels(this.options.ry) - yAxis.toPixels(0));
    }

    public getYAxis(): AxisType {
        const yAxisIndex = (this.options as EllipseShapeOptions).yAxis;
        return this.chart.yAxis[yAxisIndex];
    }

    public getAbsolutePosition(point: Highcharts.AnnotationPointType): BBoxObject {
        return this.anchor(point).absolutePosition;
    }

    /**
     *
     * Redraw the element
     * @param animation display an annimation
     */

    public redraw(animation?: boolean): void {

        const position = this.getAbsolutePosition(this.points[0]),
            position2 = this.getAbsolutePosition(this.points[1]),
            attrs = this.getAttrs(position, position2);

        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                cx: attrs.cx,
                cy: attrs.cy,
                rx: attrs.rx,
                ry: attrs.ry,
                rotation: attrs.angle,
                rotationOriginX: attrs.cx,
                rotationOriginY: attrs.cy
            });
        } else {
            this.graphic.attr({
                x: 0,
                y: -9e9
            });
        }
        this.graphic.placed = Boolean(position);
        ControllableMixin.redraw.call(this, animation);
    }

    /**
     * Set the radius Y.
     *
     * @param {number} ry a radius in y direction to be set
     */
    public setYRadius(ry: number): void {
        this.options.ry = ry;
    }
}

interface ControllableEllipse extends ControllableMixin.Type {
    // adds mixin property types, created during init
    options: EllipseShapeOptions;
}

export default ControllableEllipse;