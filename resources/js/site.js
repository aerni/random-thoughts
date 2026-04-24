import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

document.addEventListener('DOMContentLoaded', () => {
    const pills = document.querySelectorAll('.floating-pill')
    if (!pills.length) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    const activeTweens = new Map()

    function floatPill(pill) {
        const tween = gsap.to(pill, {
            x: `+=${(Math.random() - 0.5) * 180}`,
            y: `+=${(Math.random() - 0.5) * 180}`,
            duration: 2.5 + Math.random() * 3,
            ease: 'sine.inOut',
            onComplete: () => floatPill(pill),
        })
        activeTweens.set(pill, tween)
    }

    pills.forEach((pill) => {
        const pw = pill.offsetWidth
        const ph = pill.offsetHeight

        gsap.set(pill, {
            x: pw / 2 + Math.random() * (vw - pw),
            y: ph / 2 + Math.random() * (vh - ph),
        })

        floatPill(pill)

        Draggable.create(pill, {
            bounds: 'body',
            onDragStart() {
                activeTweens.get(pill)?.kill()
            },
            onDragEnd() {
                floatPill(pill)
            },
        })
    })
})
