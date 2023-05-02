
import {gsap} from "gsap/all"
import {CSSPlugin} from "gsap/CSSPlugin"
import { bringToFront,svgns } from "./api"

function manipDotConnect(gsvg,state) {

  interface Line extends SVGLineElement {
    a?: string
    b?: string
  }

  interface Node extends HTMLElement {
    lineID?: string
  }

    let lines : (Line)[]
    let nodeInFocus = ""
    const L = {nodeInFocus: null}
    const V = {nodes: [],lines: lines}

    const {dotSize,width,height} = state

    const vBox = "0 0 " +  width + " " + height

    gsap.set(gsvg,{attr:{viewBox: vBox}})
    
    function linePointerDown(e){
      e.stopPropagation()
      if (state.cutting){
        deleteLine(this.id)
      }
      if (Object.keys(state.lines).length == 0){
       state.cutting = false
       state.idInFocus = null
       nodeInFocus = null
      }
    }

    function nodePointerDown(e) {

      toggleCutting(false)

      e.stopPropagation()

      const { idInFocus } = state;
      const nodeInFocus = gsvg.getElementById(idInFocus);

      if (nodeInFocus == this) {

        // Animation
        gsap.to(this, { duration: 0.5, scale: 1, ease: "elastic" });

        // Update State
        state.idInFocus = null;

      } else if (nodeInFocus) {
        // There is a node in focus and the node we've clicked is open.

        // Animation
        gsap.to(nodeInFocus, { duration: 0.5, scale: 1, ease: "elastic" });
        gsap.fromTo(this, { duration: 0.5, scale: 2 }, { duration: 0.5, scale: 1 });

        // Create Line

        const potentialNewID1 = nodeInFocus.id + this.id
        const potentialNewID2 = this.id + nodeInFocus.id

        // Checking for duplicates.
        if (!state.lines[potentialNewID1] && !state.lines[potentialNewID2]){

            const l = createLineBetween(nodeInFocus.id,this.id)

            // Update State
            state.lines[l.id] = { a: this.id, b: nodeInFocus.id };
            state.lineNumber++;
            state.idInFocus = null;

            // Update DOM state.state.nodes
            this.lineID = l.id;
            nodeInFocus.lineID = l.id;

        }

        // Bring state.state.nodes to front
        bringToFront(this);
        bringToFront(nodeInFocus);
      } else {
   

        // Completely lonely node.
        gsap.to(this, { duration: 0.5, scale: 2, ease: "elastic" });
        
        state.idInFocus = this.id;
      }
    }

    function deleteLine(id){
      const line = document.getElementById(id)
      const {a,b} = state.lines[id]
      const nodeA: Node = document.getElementById(a)
      const nodeB: Node = document.getElementById(b)
      gsap.to(nodeA,{duration: 0.5, scale: 1})
      gsap.to(nodeB,{duration: 0.5, scale: 1})
      nodeA.lineID = null
      nodeB.lineID = null
      gsvg.removeChild(line)
      delete state.lines[id];
    }

    // DOM Manipulation Functions
    function createLineBetween(n1, n2) {
      const _x1 = state.nodes[n1].x;
      const _y1 = state.nodes[n1].y;
      const _x2 = state.nodes[n2].x;
      const _y2 = state.nodes[n2].y;

      let l: Line = document.createElementNS(svgns, "line");
      l.id = n1+n2 // ID is node names concatenated. 
      gsap.set(l, {
        stroke: state.lineColor,
        strokeWidth: dotSize,
        strokeLinecap: 'round',
        attr: { x1: _x1, y1: _y1, x2: _x2, y2: _y2 },
      });
      gsvg.appendChild(l);

      l.addEventListener('pointerdown',linePointerDown)

      return l;
    }
    
    function toggleCutting(cutting){

      state.cutting = cutting

      if (state.lines) {
        Object.keys(state.lines).forEach(l=>{
          let line = document.getElementById(l)
          bringToFront(line)
          !state.cutting && gsap.to(line,{strokeWidth: dotSize})
          state.cutting && gsap.to(line,{strokeWidth: 4*dotSize})
        })

        if (Object.keys(state.lines).length == 0){
          state.cutting = false
         }
      }


    }

    function svgPointerDown() {
      toggleCutting(!state.cutting)
    }

    // Load

    function init() {
      // Set Background

      // Check optionals 

      if (!state.lines){
        state.lines = {}
      }

      gsvg.style.backgroundImage = `url(${state.backGround})`;

      // Set Up DOM
      Object.keys(state.nodes).forEach((k) => {
        const { x, y } = state.nodes[k];

        let c = document.createElementNS(svgns, "circle");
        c.id = k;

        V.nodes.push(c)
    
        const to = 
        gsap.set(c, {
          attr: {
            r: dotSize,
          },
          x: x,
          y: y,
          fill: state.dotColor,
          //strokeOpacity: 0,
          //strokeWidth: 3 * dotSize,
          //stroke: "#ffffff",
        });
        gsvg.appendChild(c);

        c.addEventListener("pointerdown", nodePointerDown);
      });

      // Draw from State

      // Draw Lines
      (state.lines) && Object.keys(state.lines).forEach((l) => {
        // Get Node IDs
        const { a, b } = state.lines[l];
        const line = createLineBetween(a, b);
        V.lines.push(line)
        line.id = l;
        

        // Set-Up state.nodes
        const nodeA: Node = document.getElementById(a);
        const nodeB: Node = document.getElementById(b);;
        bringToFront(nodeA);
        bringToFront(nodeB);
        nodeA.lineID = l;
        nodeB.setAttribute("lineID",l);
      });

      gsvg.addEventListener('pointerdown',svgPointerDown)
    }

    // Helpers
    this.getState = function() {
      return state
    }


    init();
}
