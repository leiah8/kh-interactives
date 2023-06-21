import { svgns } from "../api"
import { gsap, Draggable } from "gsap/all";
import { CustomEase } from "gsap/CustomEase";


export class TextureSwapAPI {
    arena : HTMLElement
    input : SVGUseElement
    tl : any

    constructor(arena) {
        this.arena = arena

        this.setupElements()

        this.tl.to(this.input, {duration : 1})

        this.swapAnimation2(this.tl, this.input, "#output")

    }

    setupElements() {
        this.input = document.createElementNS(svgns, "use")
        
        this.arena.appendChild(this.input)
        this.input.setAttribute("href", "#input")
        gsap.set(this.input, { x: 200, y: 200 })

        this.tl = gsap.timeline()


    }

    swapAnimation1(tl, el, hrefStr) {
        //wiggle and scale out 

        tl.to(el, {transformOrigin : "center", duration : 0})

        var rotate = 0
        var rotateChange = 3
        var direction = 1
        var stopRotate = 15

        tl.to(el, {scale : 2, ease : "power2", duration : 1, onUpdate : function() {
            if (rotate > stopRotate) {
                rotateChange -= 0.1
                stopRotate -= 0.1
                direction = -1
            }
            else if (rotate < -stopRotate) {
                rotateChange -= 0.1
                stopRotate -= 0.1
                
                direction = 1
            }

            rotate += direction* rotateChange

            gsap.set(el, {rotation : rotate})

        }})
        tl.to(el, {scale : 2.1, rotation : -2, ease : "linear", duration : 0.1})
        tl.to(el, {scale : 0.5, rotation : 0, ease : "linear", duration : 0.2, onComplete : function() {
            el.setAttribute("href", hrefStr)
        }})
        tl.to(el, {scale : 1, ease : "elastic", duration : 0.6})

        tl.to(el, {transformOrigin : "top left", duration : 0})


    }

    swapAnimation2(tl, el, hrefStr) {
        //scale out and scale in 

        gsap.registerPlugin(CustomEase)

        var s = "M0,0 C0,0 0.143,0.055 0.15,0.145 0.169,0.399 0.175,0.53 0.194,0.786 0.201,0.884 0.204,0.936 0.214,1.033 0.22,1.104 0.238,1.29 0.238,1.3 0.238,1.314 0.251,1.403 0.256,1.422 0.259,1.431 0.264,1.44 0.268,1.446 0.269,1.448 0.273,1.449 0.275,1.448 0.278,1.446 0.282,1.442 0.284,1.438 0.291,1.422 0.309,1.334 0.312,1.316 0.328,1.202 0.319,1.178 0.342,1.066 0.352,1.015 0.361,0.976 0.368,0.941 0.378,0.89 0.389,0.824 0.396,0.806 0.399,0.8 0.402,0.796 0.406,0.791 0.409,0.788 0.412,0.784 0.416,0.783 0.42,0.782 0.426,0.782 0.431,0.784 0.436,0.786 0.442,0.79 0.446,0.796 0.474,0.842 0.482,0.946 0.5,1 0.504,1.011 0.534,1.122 0.543,1.129 0.55,1.134 0.558,1.137 0.566,1.14 0.571,1.141 0.576,1.14 0.581,1.139 0.587,1.138 0.591,1.137 0.596,1.134 0.624,1.119 0.638,1.062 0.658,1.028 0.674,1 0.683,0.99 0.692,0.987 0.7,0.985 0.706,0.984 0.715,0.983 0.726,0.983 0.733,0.983 0.745,0.985 0.774,0.99 0.792,1.027 0.821,1.032 0.837,1.035 0.846,1.036 0.861,1.036 0.917,1.035 0.884,1.024 0.936,0.998 0.986,0.972 1,1 1,1 "
        // var a = s.split(",")
        // a.reverse()
        // var sO = a.join(",")

        CustomEase.create("custom", s)
        // CustomEase.create("custom2", sO)


        tl.to(el, {transformOrigin : "center", duration : 0})

        tl.to(el, {scale : 3, ease : "custom", duration : 1.4})
        tl.to(el, {scale : 3.2, ease : "linear", duration : 0.2})
        tl.to(el, {scale : 0.5, ease : "linear", duration : 0.2, onComplete : function() {
            el.setAttribute("href", hrefStr)
        }})
        tl.to(el, {scale : 1.2, ease : "linear", duration : 0.2})
        tl.to(el, {scale : 1, ease : "linear", duration : 0.1 })

        tl.to(el, {transformOrigin : "top left", duration : 0})

    }

    swapAnimation3() {

    }
}