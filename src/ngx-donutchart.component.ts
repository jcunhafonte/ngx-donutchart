import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgXDonutChartSlice} from './ngx-donutchart.type';

type SliceAnchors = {
    P: {
        x: number
        y: number
    }
    Q: {
        x: number
        y: number
    }
    R: {
        x: number
        y: number
    }
    S: {
        x: number
        y: number
    }
};

@Component({
    selector: 'ngx-donutchart',
    templateUrl: './ngx-donutchart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgXDonutChartComponent {
    /**
     * @description Component size
     */
    @Input()
    public size = 0;

    /**
     * @description Inner circle size
     */
    @Input()
    public innerRadius = 0;

    /**
     * @description Title string
     */
    @Input()
    public title: string;

    /**
     * @description Slices to be rendered
     */
    @Input()
    public slices: NgXDonutChartSlice[] = [];

    /**
     * @description Output method with slice hovered
     */
    @Output()
    public onSliceHover: EventEmitter<NgXDonutChartSlice> = new EventEmitter<NgXDonutChartSlice>();

    private _startAngle = 0;

    /**
     * @description Retrieve svg viewBox
     */
    public getViewBox(): string {
        return `0 0 ${this.getSize()} ${this.getSize()}`;
    }

    /**
     * @description Retrieve svg size in pixels
     */
    public getPXSize(): string {
        return `${this.size.toString()}px`;
    }

    /**
     * @description Retrieve component size
     */
    public getSize(): number {
        return this.size;
    }

    /**
     * @description Retrieve title
     */
    public getTitle(): string {
        return this.title;
    }

    /**
     * @description Track by function for path
     */
    public trackByFn(index: number, item: NgXDonutChartSlice): number {
        return index;
    }

    /**
     * @description Triggered when mouse enters
     */
    public handleMouseEnter(slice: NgXDonutChartSlice): void {
        this.onSliceHover.emit(slice)
    }

    /**
     * @description Triggered when mouse leaves
     */
    public handleMouseLeave(): void {
        this.onSliceHover.emit(null)
    }

    /**
     * @description Retrieve data automation selector
     */
    public getDataAutomationSelector(selector: string, index?: number): string {
        return `${selector}${index || index === 0 ? '-' + index : ''}`;
    }

    /**
     * @description Retrieve summed value slices
     */
    public getTotal(): number {
        return this.slices.reduce((a: number, b: NgXDonutChartSlice) => a + b.value, 0);
    }

    /**
     * @description Retrieve fill of slice passed in
     */
    public getPathFill(slice: NgXDonutChartSlice): string {
        return slice.color;
    }

    /**
     * @description Checks if a given path can be rendered
     */
    public canRenderPath(slice: NgXDonutChartSlice): boolean {
        return slice.value > 0 && this.getTotal() > 0;
    }

    /**
     * @description Retrieve path data of empty slice or path data of slice passed in
     */
    public getPathData(slice: NgXDonutChartSlice): string {
        return this._canRenderEmptySlice() ? this._getEmptyPathData() : this._getCompoundPathData(slice);
    }

    private _getEmptyPathData(): string {
        const outerRadius: number = this.getSize() / 2;

        return `
            M ${outerRadius} ${outerRadius}
            m 0 -${outerRadius}
            a ${outerRadius} ${outerRadius} 0 1 0 1 0
            Z
            m 0 ${outerRadius - this.innerRadius}
            a ${this.innerRadius} ${this.innerRadius} 0 1 1 -1 0
            Z
        `;
    }

    private _getCompoundPathData(slice: NgXDonutChartSlice): string {
        const outerRadius: number = this.getSize() / 2;
        const sectorAngle: number = this._getScaledData(slice.value);
        const calculatedAnchor: SliceAnchors = this._getCalculatedAnchors(this._startAngle, this._startAngle + sectorAngle, outerRadius, this.innerRadius);

        const {P, Q, R, S} = calculatedAnchor;

        this._startAngle += sectorAngle;

        const endAngle: number = this._startAngle + sectorAngle;
        const largeArc: boolean = endAngle - this._startAngle > Math.PI;

        return `
            M ${P.x}, ${P.y}
            A ${outerRadius} ${outerRadius} 0 ${largeArc ? '1,1' : '0,1'} ${Q.x} ${Q.y}
            L ${R.x} ${R.y}
            A ${this.innerRadius} ${this.innerRadius} 0 ${largeArc ? '1,0' : '0,0'} ${S.x} ${S.y}
            Z
        `;
    }

    private _canRenderEmptySlice(): boolean {
        let slicesWithValue = 0;

        this.slices.map((slice: NgXDonutChartSlice) => slice.value > 0 ? slicesWithValue++ : null);

        return slicesWithValue === 1;
    }

    private _getCalculatedAnchors(startAngle: number, endAngle: number, outerRadius: number, innerRadius: number): SliceAnchors {
        const sinAlpha: number = this._getAbbreviatedNumber(Math.sin(startAngle));
        const cosAlpha: number = this._getAbbreviatedNumber(Math.cos(startAngle));
        const sinBeta: number = this._getAbbreviatedNumber(Math.sin(endAngle));
        const cosBeta: number = this._getAbbreviatedNumber(Math.cos(endAngle));

        const P = {
            x: outerRadius + (outerRadius * sinAlpha),
            y: outerRadius - (outerRadius * cosAlpha)
        };

        const Q = {
            x: outerRadius + (outerRadius * sinBeta),
            y: outerRadius - (outerRadius * cosBeta)
        };

        const R = {
            x: outerRadius + (innerRadius * sinBeta),
            y: outerRadius - (innerRadius * cosBeta)
        };

        const S = {
            x: outerRadius + (innerRadius * sinAlpha),
            y: outerRadius - (innerRadius * cosAlpha)
        };

        return {P, Q, R, S};
    }

    private _getScaledData(value: number): number {
        return (value * Math.PI * 2) / this.getTotal() || 0;
    }

    private _getAbbreviatedNumber(number: number, digits = 12): number {
        return parseFloat(Number(number).toFixed(digits));
    }
}