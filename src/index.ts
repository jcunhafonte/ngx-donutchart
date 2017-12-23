import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgXDonutChartComponent} from './ngx-donutchart.component';

export * from './ngx-donutchart.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgXDonutChartComponent
    ],
    exports: [
        NgXDonutChartComponent
    ]
})
export class NgXDonutChartModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgXDonutChartModule
        };
    }
}
