import RafThrottle from '@utilities/raf-throttle'

// const SIDEBAR_HOOK = '[js-hook-sidebar]'
const SIDEBAR_CONTENT_HOOK = '[js-hook-sidebar-content]'
const SIDEBAR_SVG_HOOK = '[js-hook-sidebar-svg]'
const SIDEBAR_PATH_HOOK = '[js-hook-sidebar-svg-path]'
const HAMBURGER_HOOK = '[js-hook-hamburger]'

class Sidebar {
  constructor(element) {
    this.element = element
    this.hamburger = document.querySelector(HAMBURGER_HOOK)
    this.svg = element.querySelector(SIDEBAR_SVG_HOOK)
    this.path = element.querySelector(SIDEBAR_PATH_HOOK)
    this.content = element.querySelector(SIDEBAR_CONTENT_HOOK)

    this.mouseClickHandler = e => this.handleMouseClick(e)
    this.mouseMoveHandler = e => this.handleMouseMove(e)
    this.mouseDownHandler = e => this.handleMouseDown(e)
    this.mouseUpHandler = e => this.handleMouseUp(e)
    this.closeSidebarHandler = e => this.closeSidebar(e)

    this.config = {
      demoTop: this.element.offsetTop,
      demoLeft: this.element.offsetLeft,
      diffX: 0,
      curX: 0,
      finalX: 0,
      startX: 0,
      frame: 1000 / 60,
      animTime: 600,
      sContTrans: 200,
      animating: false,
    }

    this.easings = {
      smallElastic: (t, b, c, d) => {
        const ts = (t /= d) * t
        const tc = ts * t
        return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t)
      },
      inCubic: (t, b, c, d) => {
        const tc = (t /= d) * t * t
        return b + c * tc
      },
    }

    this.init()
    this.bindEvents()
    this.bindHandlers()
  }

  init() {
    this.startD = this.createD(150, 0, 1)
    this.midD = this.createD(125, 75, 0)
    this.finalD = this.createD(300, 0, 1)
    this.clickMidD = this.createD(300, 80, 0)
    this.clickMidDRev = this.createD(200, 150, 1)
    this.clickD = this.createD(300, 0, 1)
    this.currentPath = this.startD
  }

  animatePathD(d, time, handlers, callback, easingTop, easingX) {
    const steps = Math.floor(time / this.config.frame)
    let curStep = 0
    const oldArr = this.currentPath.split(' ')
    const newArr = d.split(' ')
    const oldTop = +oldArr[1].split(',')[0]
    const topDiff = +newArr[1].split(',')[0] - oldTop
    let nextTop
    let nextX
    easingTop = this.easings[easingTop] || this.easings.smallElastic
    easingX = this.easings[easingX] || easingTop

    this.path.removeEventListener('mousedown', this.mouseDownHandler)
    document.removeEventListener('mouseup', this.mousUpHandler)

    const animate = () => {
      curStep++
      nextTop = easingTop(curStep, oldTop, topDiff, steps)
      nextX = easingX(curStep, this.config.curX, this.config.finalX - this.config.curX, steps)
      oldArr[1] = nextTop + ',0'
      oldArr[2] = 'a' + Math.abs(nextX) + ',250'
      oldArr[4] = nextX >= 0 ? '1,1' : '1,0'
      this.path.setAttribute('d', oldArr.join(' '))
      if (curStep > steps) {
        this.config.curX = 0
        this.config.diffX = 0
        this.path.setAttribute('d', d)
        this.currentPath = d
        if (handlers) this.bindHandlers()
        if (callback) callback()
        return
      }
      requestAnimationFrame(animate)
    }
    animate()
  }

  createD(top, ax, dir) {
    return `M0,0 ${top},0 a${ax},250 0 1,${dir} 0,1500 L0,1500`
  }

  newD(num1, num2) {
    num2 = num2 || 250
    const d = this.path.getAttribute('d')
    const nd = d.replace(/\ba(\d+),(\d+)\b/gi, 'a' + num1 + ',' + num2)
    return nd
  }

  updateOffsets() {
    this.config = {
      ...this.config,
      demoTop: this.element.offsetTop,
      demoLeft: this.element.offsetLeft,
    }
  }

  handleMouseMove(e) {
    this.element.classList.add('is--dragging')
    const x = e.pageX || e.touches[0].pageX
    this.config.diffX = x - this.config.startX
    if (this.config.diffX < 0) this.config.diffX = 0
    if (this.config.diffX > 300) this.config.diffX = 300
    this.config.curX = Math.floor(this.config.diffX / 2)
    this.path.setAttribute('d', this.newD(this.config.curX))
  }

  handleMouseDown(e) {
    console.log(e.originalEvent)
    console.log(e.touches)
    this.config.startX = e.pageX || e.touches[0].pageX
    document.addEventListener('mousemove', this.mouseMoveHandler)
    document.addEventListener('touchmove', this.mouseMoveHandler)
  }

  handleMouseUp() {
    document.removeEventListener('mousemove', this.mouseMoveHandler)
    document.removeEventListener('touchmove', this.mouseMoveHandler)

    if (this.config.animating) return
    if (!this.config.diffX) return
    if (this.config.diffX < 40) {
      this.animatePathD(this.newD(0), this.config.animTime, true)
    } else {
      this.openSidebar()
    }
  }

  openSidebar() {
    this.animatePathD(this.finalD, this.config.animTime, false, () => {
      this.content.classList.add('is--active')
      this.element.classList.remove('is--dragging')
      this.element.classList.add('is--open')
      this.hamburger.classList.add('is--open')
      setTimeout(() => {
        document.addEventListener('click', this.closeSidebarHandler)
      }, this.config.sContTrans)
    })
  }

  handleMouseClick() {
    if (this.hamburger.classList.contains('is--open')) {
      this.closeSidebar()
    } else {
      this.openSidebar()
    }
  }

  closeSidebar(e) {
    if (e.target.closest('.sidebar__content')) return
    if (this.config.animating) return
    this.config.animating = true
    this.content.classList.remove('is--active')
    this.config.finalX = -75

    setTimeout(() => {
      this.animatePathD(
        this.midD,
        this.config.animTime / 3,
        false,
        () => {
          this.config.finalX = 0
          this.config.curX = -75
          this.animatePathD(this.startD, (this.config.animTime / 3) * 2, true)
          this.config.animating = false
          this.element.classList.remove('is--open')
          this.hamburger.classList.remove('is--open')
        },
        'inCubic',
      )
    }, this.config.sContTrans)
    document.removeEventListener('click', this.closeSidebarHandler)
  }

  bindHandlers() {
    this.hamburger.addEventListener('click', this.mouseClickHandler)
    this.path.addEventListener('mousedown', this.mouseDownHandler)
    this.path.addEventListener('touchstart', this.mouseDownHandler)

    document.addEventListener('mouseup', this.mouseUpHandler)
    document.addEventListener('touchend', this.mouseUpHandler)
  }

  /**
   * Bind all general events
   */
  bindEvents() {
    RafThrottle.set([
      {
        element: window,
        event: 'resize',
        namespace: 'SidebarOffsetChange',
        fn: () => this.updateOffsets(),
      },
    ])
  }
}

export default Sidebar
