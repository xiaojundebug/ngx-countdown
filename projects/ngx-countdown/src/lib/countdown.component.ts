import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core'
import { interval, Subscription } from 'rxjs'
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame'
import { isSameSecond, parseFormat, parseTimeData, TimeData } from './utils'

interface CountdownData {
  remain: number
  formattedTime: string
  fragments: any[]
}
export enum CountdownState {
  /** 暂停状态 */
  paused,
  /** 运行状态 */
  playing,
  /** 完成状态 */
  finished
}

/**
 * 所有组件实例使用同一个 interval 流，以免实例多了后造成卡顿
 */
const instances = []
const counter$ = interval(0, animationFrame)
let counterSub: Subscription

function setupCounter() {
  destroyCounter()
  counterSub = counter$.subscribe(() => {
    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i]

      if (inst.state !== CountdownState.playing) {
        continue
      }

      if (inst.remain <= 0) {
        inst.state = CountdownState.finished
        inst.cdr.detectChanges()
        inst.finish.emit()
        continue
      }

      const remain = Math.max(inst.endTime - Date.now(), 0)

      if (!inst.millisecond) {
        if (!isSameSecond(remain, inst.remain) || remain === 0) {
          inst.remain = remain
          inst.tick.emit(inst.remain)
        }
      } else {
        inst.remain = remain
        inst.tick.emit(inst.remain)
      }

      inst.cdr.detectChanges()
    }
  })
}
function destroyCounter() {
  counterSub && counterSub.unsubscribe()
}

/**
 * 倒计时组件
 */
@Component({
  selector: 'ngx-countdown',
  templateUrl: './countdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownComponent implements OnInit, OnDestroy {
  /** 格式 */
  @Input() format: string = 'HH:mm:ss'
  /** 是否自动开始 */
  @Input() autoStart: boolean = true
  /** 是否开启毫秒级渲染 */
  @Input() millisecond: boolean = false
  /** 自定义模版 */
  @Input() render: TemplateRef<any>
  /** 总毫秒数 */
  @Input()
  set time(value: number) {
    this._time = Math.max(value, 0)
    this.reset()
  }
  get time() {
    return this._time
  }

  /** 倒计时完毕时触发 */
  @Output() finish = new EventEmitter<any>()
  /** 每倒计时一次都触发 */
  @Output() tick = new EventEmitter<number>()

  state: CountdownState = CountdownState.paused
  get data(): CountdownData {
    const noMillisecond = this.format.indexOf('S') === -1,
      isPlaying = this.state === CountdownState.playing

    // 即使 format 中没有设置毫秒，程序计算时候也会将毫秒计算进去，导致运行时秒数看上去总是小 1
    // 此处在渲染时候手动 +1 秒，以追求视觉统一
    const timeData = parseTimeData(this.remain + (noMillisecond && isPlaying ? 1000 : 0))
    const formattedTime = parseFormat(this.format, timeData)
    return {
      formattedTime,
      remain: this.remain,
      fragments: formattedTime.split(':')
    }
  }

  private _time: number = 60000
  /** 剩余毫秒数 */
  private remain: number
  private endTime: number

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    instances.push(this)
    if (instances.length === 1) {
      setupCounter()
    }
  }

  ngOnDestroy() {
    this.pause()
    const index = instances.indexOf(this)
    if (index !== -1) {
      instances.splice(index, 1)
    }
    if (instances.length === 0) {
      destroyCounter()
    }
  }

  /**
   * 继续倒计时
   */
  start() {
    if (this.state === CountdownState.playing) {
      return
    }

    if (this.state === CountdownState.finished) {
      this.remain = this.time
    }

    this.endTime = Date.now() + this.remain
    this.state = CountdownState.playing
  }

  /**
   * 暂停倒计时
   */
  pause() {
    this.state = CountdownState.paused
  }

  /**
   * 重置倒计时
   */
  reset() {
    this.pause()
    this.remain = this.time
    this.cdr.detectChanges()

    if (this.autoStart) {
      this.start()
    }
  }
}
