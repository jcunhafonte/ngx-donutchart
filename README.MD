# ngx-donutchart

`ngx-donutchart` is an Angular component built with _TypeScript_, _HTML5_ and _Angular >= 4_. It is an Angular component for presenting donut charts in a light package with no external dependencies. The chart just consume your data and doesn't make any assumptions about your datastructure or how you handle it.

![Preview](https://github.com/jcunhafonte/ngx-donutchart/blob/master/src/preview.png)

## Features
- Handle large data sets (Virtual DOM)
- Easy configuration and manipulation
- Light codebase / No external dependencies
- Easy selectors for testing purposes
- AoT compilation support

## Installation

All you need to do is to run the following command:

```bash
$ npm install ngx-donutchart --save
```

## Usage

Import ngx-donutchart directives into your component:

```typescript
import {NgModule} from '@angular/core';

...

import {NgXDonutChartModule} from 'ngx-donutchart';
```

Register it by adding to the list of directives of your module:

```typescript
@NgModule({
  imports: [
    ...
    NgXDonutChartModule
  ],
  ...
})
export class AppModule {
}
```

Configure the chart and add it into the template by registering <i>slices</i>, <i>size</i> and <i>innerRadius</i> property.
    
```typescript
import {NgXDonutChartSlice} from 'ngx-donutchart/ngx-donutchart.type';

slices: NgXDonutChartSlice[] | any[] = [ // exported type
    {
      value: 1,
      color: 'red'
    },
    {
      value: 2,
      color: 'green'
    },
    {
      value: 3,
      color: 'blue'
    }
];

size = 170;

innerRadius = 60
```

Add ngx-donutchart component inside to the template:

```typescript
// ...

@Component({
    template: `
    <ngx-donutchart 
        [slices]="slices"
        [size]="size"
        [innerRadius]="innerRadius">
    </ngx-donutchart>
    `
})
// ...
```

Now you have some slices in your donut chart.

The event available with this component is:
- onSliceHover

Add them as outputs to listen the events.

```typescript
@Component({
    template: `
    <ngx-donutchart 
        [slices]="slices"
        [size]="size"
        [onSliceHover]="...($event)">
    </ngx-donutchart>
    `
})
```

Optionally you can add a title to the middle of your component by registering <i>title</i>:
```typescript
@Component({
    template: `
    <ngx-donutchart 
        [title]="'NgXDonutChart'"
        [slices]="slices"
        [size]="size"
        [onSliceHover]="...($event)">
    </ngx-donutchart>
    `
})
```

## License

MIT © [jcunhafonte](mailto:jcunhafonte@gmail.com)

Built with :heart: by [jcunhafonte](https://jcunhafonte.com)