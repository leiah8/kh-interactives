import { gsap, Draggable } from "gsap/all";
import {svgns} from "../api"


/*
this.robot = document.createElementNS(svgns,"use")
this.arena.appendChild(this.robot)
this.robot.setAttribute("href","#robot")
*/

interface InputSetup {
    arena : SVGSVGElement,
    platform : SVGSVGElement,
    controls : SVGSVGElement,
  }

export class IntegerPlatfromClass {
    arena : SVGSVGElement;
    platform : SVGSVGElement;
    controls : SVGSVGElement;

    constructor(setup) {
        this.arena = setup.arena
        this.platform = setup.platform
        this.controls = setup.controls

        this.setupEls()

    }

    setupEls() {

        //ground
        var left = document.createElementNS(svgns,"use")
        this.arena.appendChild(left)

        var right = document.createElementNS(svgns,"use")
        this.arena.appendChild(right)

        left.setAttribute("href","#ground")
        right.setAttribute("href","#ground")

        gsap.set(left, {y : 400})
        gsap.set(right, {x : 830, y : 400})

        //platform surface
        var surface = document.createElementNS(svgns,"use")
        this.platform.appendChild(surface)
        surface.setAttribute("href","#surface")
        gsap.set(surface, {x : 450, y : 400})

        //spring
        var spring = document.createElementNS(svgns,"use")
        this.arena.appendChild(spring)
        spring.setAttribute("href","#spring")
        gsap.set(spring, {x : 580, y : 420})

        //play button
        var playBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(playBtn)
        playBtn.setAttribute("href","#playBtn")
        gsap.set(playBtn, {x : 10, y : 10})

        //add button
        var addBtn = document.createElementNS(svgns,"use")
        this.controls.appendChild(addBtn)
        addBtn.setAttribute("href","#addBtn")
        gsap.set(addBtn, {x : 840, y : 10})

    }
}