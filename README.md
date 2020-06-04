# NgxCountdown

An angular countdown component.

<p align="center">
  <img alt="travis" src="https://travis-ci.org/xiaojun1994/ngx-countdown.svg?branch=master">&nbsp;
</p>

👉 [Demo](https://stackblitz.com/edit/ngx-countdown-demo)

## Install

```bash
npm i @ciri/ngx-countdown
```

## Quick Start

Add it to your module:

```typescript
import { CountdownModule } from '@ciri/ngx-countdown'

@NgModule({
  // ...
  imports: [
    // ...
    CountdownModule
  ],
})
```

Add to view:

```html
<ngx-countdown [time]="86400000"></ngx-countdown>
<br />
<ngx-countdown [time]="60000" format="ss"></ngx-countdown>s
```

## Millisecond Render

```html
<ngx-countdown [time]="86400000" [millisecond]="true" format="HH:mm:ss SSS"></ngx-countdown>
```

## Manual Control

```html
<ngx-countdown
  #counter
  [time]="10000"
  format="HH:mm:ss:SSS"
  [millisecond]="true"
  [autoStart]="false"
></ngx-countdown
>&nbsp;state: {{ counter.state }}
<br />
<button (click)="counter.start()">start</button>&nbsp;
<button (click)="counter.pause()">pause</button>&nbsp;
<button (click)="counter.reset()">reset</button>
```

## Custom Render

```html
<ngx-countdown [time]="86400000 * 2" [render]="render" format="HH:mm:ss:SSS" [millisecond]="true">
  <ng-template #render let-data>
    <span style="font-size: 26px; color: royalblue">{{ data.formattedTime }}</span>
    <div style="display: flex">
      <span style="color: #D95140">{{ data.fragments[0] }}</span>:
      <span style="color: #58A55C">{{ data.fragments[1] }}</span>:
      <span style="color: #F2BE42">{{ data.fragments[2] }}</span>:
      <span style="color: #5086EC">{{ data.fragments[3] }}</span>
    </div>
    <span>remain: {{ data.remain }}ms</span>
  </ng-template>
</ngx-countdown>
```

## Inputs

| Name        | Type             | Default  | Description                                               |
| ----------- | ---------------- | -------- | --------------------------------------------------------- |
| time        | number           | 60000    | Total time(milliseconds)                                  |
| format      | string           | HH:mm:ss | Time format, see: [Available Formats](#available-formats) |
| autoStart   | boolean          | true     | Whether to auto start count down                          |
| millisecond | boolean          | false    | Whether to enable millisecond render                      |
| render      | TemplateRef<any> | -        | Custom render                                             |

## Outputs

| Event  | Description                        | Return value |
| ------ | ---------------------------------- | ------------ |
| finish | Triggered when count down finished | -            |
| tick   | Triggered when count down changed  | Remain time  |

## Available Formats

| Event | Description           |
| ----- | --------------------- |
| DD    | Day                   |
| HH    | Hour                  |
| mm    | Minute                |
| ss    | Second                |
| S     | Millisecond, 1-digit  |
| SS    | Millisecond, 2-digits |
| SSS   | Millisecond, 3-digits |

## Public Api

| Name  | Type     | Description                                          |
| ----- | -------- | ---------------------------------------------------- |
| state | number   | Current state: 0 = paused, 1 = playing, 2 = finished |
| start | function | Start count down                                     |
| pause | function | Pause count down                                     |
| reset | function | Reset count down                                     |
