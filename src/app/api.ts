import {gsap} from "gsap/all"

export const svgns = "http://www.w3.org/2000/svg";

// For passing an arbitrary object.
export function bringToFront(obj) {
    let parent = obj.parentElement
    parent.removeChild(obj);
    parent.appendChild(obj);
}

// For attaching to draggables
function bringThisToFront() {
    bringToFront(this.target)
}

function createCircleFromPath(r){
  let circ = document.createElementNS(svgns,"path")
  const p = `M 0 ${r} a ${r} ${r} 0 1 1 ${2*r} 0 a ${r} ${r} 0 1 1 ${-2*r} 0 `
  circ.setAttribute("d",p)
  return circ
}

function roundedRectData(w, h, tlr, trr, brr, blr) {
  return 'M 0 ' + tlr
    + ' A ' + tlr + ' ' + tlr + ' 0 0 1 ' + tlr + ' 0'
    + ' L ' + (w - trr) + ' 0'
    + ' A ' + trr + ' ' + trr + ' 0 0 1 ' + w + ' ' + trr
    + ' L ' + w + ' ' + (h - brr)
    + ' A ' + brr + ' ' + brr + ' 0 0 1 ' + (w - brr) + ' ' + h
    + ' L ' + blr + ' ' + h
    + ' A ' + blr + ' ' + blr + ' 0 0 1 0 ' + (h - blr)
    + ' Z';
};

function createRoundedRectFromPath(w,h,r){
  const p = roundedRectData(w,h,r,r,r,r)
  let rRect = document.createElementNS(svgns,"path")
  rRect.setAttribute("d",p)
  return rRect
}

function createJumpFromPath(r){
  let jump = document.createElementNS(svgns,"path")
  const p = `M 0 ${r} a ${r} ${r} 0 1 1 ${2*r} 0 `
  jump.setAttribute("d",p)
  jump.setAttribute('stroke',"black")
  jump.setAttribute('stroke-width',"5")
  jump.setAttribute('fill','white')
  return jump
}


// Returns a clean copy of a number divided by a power of ten.
export function applyDecimalOffset(num,dec){
  let returnValue = num
  
  if (dec != null) {
    const decimals = dec && dec
    const divided = num/Math.pow(10,decimals)
    returnValue = divided.toFixed(dec)
  }

  return returnValue
}

// ARGYLE:
function isThisNodeOnThisLine(node,line) {
    // Use isThisPointOnALineBetween

    // return Boolean Value
}

// NodeClicked: Find all the lines that are currently passing through this node

// Returns false if no lines can be consolidated, returns nodes if 
function consolidateLines(l,lines){
    // "l" is a new line that may or may not need to be consolidated. 
    // "lines" is an object that contains the other lines currently on the grid. 



    // return {idOfConsolidatedNodes: [nodeID1,nodeID2], idOfLineThatNeedsToBeRemoved: []}
}



export function getBoundingBoxWithTransform(elem){
  let bbox_elem= elem.getBBox();

  // Apply transform to bounding box.
  const elemX = bbox_elem.x + gsap.getProperty(elem, "translateX");
  const elemY = bbox_elem.y + gsap.getProperty(elem, "translateY");

  return {x: elemX, y: elemY}
}


// Finds dx and dy between two objects
function transformDelta(from, to) {
  // Safest to recalculate.
  let bbox_From = from.getBBox();
  let bbox_To = to.getBBox();

  // Apply transform to bounding box.
  const fromX = bbox_From.x + gsap.getProperty(from, "translateX");
  const fromY = bbox_From.y + gsap.getProperty(from, "translateY");

  const toX = bbox_To.x + gsap.getProperty(to, "translateX");
  const toY = bbox_To.y + gsap.getProperty(to, "translateY");

  let _dx = toX - fromX;
  let _dy = toY - fromY;

  return { dx: _dx, dy: _dy };
}

// Finds the coordinates to "to" from "from"
function coordinateTransformation(from, to) {
  const _transformDelta = transformDelta(from, to);

  let _x = gsap.getProperty(from, "translateX") + _transformDelta.dx;
  let _y = gsap.getProperty(from, "translateY") + _transformDelta.dy;

  return { x: _x, y: _y };
}