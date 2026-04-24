import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

document.fonts.ready.then(() => requestAnimationFrame(() => {
    const els = document.querySelectorAll('.floating-pill')
    if (!els.length) return

    const BASE_SPEED = 0.9
    const MAX_SPEED = 18
    const RESTITUTION = 2.0

    const container = els[0].closest('.pills-container')
    const bounds = () => container.getBoundingClientRect()

    class Pill {
        constructor(el) {
            this.el = el
            gsap.set(el, { x: 0, y: 0, left: 0, top: 0 })
            this.w = el.offsetWidth
            this.h = el.offsetHeight
            const b = bounds()
            this.x = Math.random() * (b.width - this.w)
            this.y = Math.random() * (b.height - this.h)
            const angle = Math.random() * Math.PI * 2
            this.vx = Math.cos(angle) * BASE_SPEED
            this.vy = Math.sin(angle) * BASE_SPEED
            this.targetSpeed = BASE_SPEED * (0.6 + Math.random() * 0.8)
            this.rotation = 0
            this.rotPhase = Math.random() * Math.PI * 2
            this.rotSpeed = 0.25 + Math.random() * 0.35
            this.rotAmplitude = 2 + Math.random() * 4
            this.dragging = false
            this.prevDragX = this.x
            this.prevDragY = this.y
            this.velocityHistory = []
            gsap.set(el, { x: this.x, y: this.y })
        }

        update(dt) {
            const factor = dt / (1000 / 60)

            if (this.dragging) {
                const rawVx = (this.x - this.prevDragX) / factor
                const rawVy = (this.y - this.prevDragY) / factor
                this.velocityHistory.push({ vx: rawVx, vy: rawVy })
                if (this.velocityHistory.length > 6) this.velocityHistory.shift()
                this.prevDragX = this.x
                this.prevDragY = this.y
                return
            }

            // Gentle random direction drift
            const drift = (Math.random() - 0.5) * 0.04
            const cos = Math.cos(drift)
            const sin = Math.sin(drift)
            const vx = this.vx * cos - this.vy * sin
            const vy = this.vx * sin + this.vy * cos
            this.vx = vx
            this.vy = vy

            // Gradually bleed off excess speed, then softly nudge toward natural target
            const speed = Math.hypot(this.vx, this.vy)
            if (speed > 0) {
                const friction = speed > this.targetSpeed ? 0.97 : 1
                const nudge = 1 + (this.targetSpeed - speed) * 0.015
                this.vx *= friction * nudge
                this.vy *= friction * nudge
            }

            this.x += this.vx * factor
            this.y += this.vy * factor
            this.bounceWalls()

            // Independent sinusoidal wobble per pill
            this.rotation = Math.sin(performance.now() / 1000 * this.rotSpeed + this.rotPhase) * this.rotAmplitude

            gsap.set(this.el, { x: this.x, y: this.y, rotation: this.rotation })
        }

        bounceWalls() {
            const { width, height } = bounds()
            if (this.x <= 0) { this.x = 0; this.vx = Math.abs(this.vx) }
            if (this.x + this.w >= width) { this.x = width - this.w; this.vx = -Math.abs(this.vx) }
            if (this.y <= 0) { this.y = 0; this.vy = Math.abs(this.vy) }
            if (this.y + this.h >= height) { this.y = height - this.h; this.vy = -Math.abs(this.vy) }
        }

        clampSpeed() {
            const speed = Math.hypot(this.vx, this.vy)
            if (speed > MAX_SPEED) {
                this.vx = (this.vx / speed) * MAX_SPEED
                this.vy = (this.vy / speed) * MAX_SPEED
            }
        }
    }

    const pills = Array.from(els).map(el => new Pill(el))

    function resolveCollisions() {
        for (let i = 0; i < pills.length; i++) {
            for (let j = i + 1; j < pills.length; j++) {
                const a = pills[i]
                const b = pills[j]
                if (a.dragging || b.dragging) continue

                const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
                const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)

                if (ox <= 0 || oy <= 0) continue

                if (ox < oy) {
                    const tmp = a.vx
                    a.vx = b.vx * RESTITUTION
                    b.vx = tmp * RESTITUTION
                    const sep = ox / 2 + 1
                    if (a.x < b.x) { a.x -= sep; b.x += sep } else { a.x += sep; b.x -= sep }
                } else {
                    const tmp = a.vy
                    a.vy = b.vy * RESTITUTION
                    b.vy = tmp * RESTITUTION
                    const sep = oy / 2 + 1
                    if (a.y < b.y) { a.y -= sep; b.y += sep } else { a.y += sep; b.y -= sep }
                }

                a.bounceWalls()
                b.bounceWalls()
                a.clampSpeed()
                b.clampSpeed()
            }
        }
    }

    gsap.ticker.add((_time, deltaTime) => {
        pills.forEach(p => p.update(deltaTime))
        resolveCollisions()
    })

    pills.forEach(pill => {
        Draggable.create(pill.el, {
            bounds: 'body',
            onDragStart() {
                pill.dragging = true
                pill.prevDragX = pill.x
                pill.prevDragY = pill.y
                pill.vx = 0
                pill.vy = 0
            },
            onDrag() {
                pill.x = this.x
                pill.y = this.y
            },
            onDragEnd() {
                pill.x = this.x
                pill.y = this.y
                pill.dragging = false

                // Use peak velocity from recent history for the throw
                const history = pill.velocityHistory
                if (history.length) {
                    const peak = history.reduce((best, v) =>
                        Math.hypot(v.vx, v.vy) > Math.hypot(best.vx, best.vy) ? v : best
                    )
                    pill.vx = peak.vx
                    pill.vy = peak.vy
                }

                pill.clampSpeed()
                if (Math.hypot(pill.vx, pill.vy) < 0.5) {
                    const angle = Math.random() * Math.PI * 2
                    pill.vx = Math.cos(angle) * BASE_SPEED
                    pill.vy = Math.sin(angle) * BASE_SPEED
                }
            },
        })
    })
}))
