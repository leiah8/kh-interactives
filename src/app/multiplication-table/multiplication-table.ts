//https://codepen.io/dannievinther/pen/PdvvQv
//http://jsfiddle.net/v9f0ngu5/

export class MultiplicationTableClass {
    table : HTMLElement;
    constructor(setup) {
      this.table = setup.table
      this.main(setup)
    }
  
    main(setup) {
        var n  = 10
        var m = 10

        var cols = ""
        for(var i = 0; i < m; i++) {
            cols += "10vw "
        }

        var listStyle = "grid-column: 1 / -1; list-style: none; padding: 0; display: grid; grid-gap: 10px; overflow-x : auto; scroll-snap-type: x proximity;"
        listStyle += "grid-template-columns: " + cols + "; grid-template-rows: 50px;"
        
       
        var elStyle = "scroll-snap-align: center; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 8px; font-size : 14px;font-family : 'Poppins';"

        // var lists = document.querySelectorAll('.row'); 
        // var i = 1;
        // lists.forEach(row => {
        //     for (var j = 1; j <= m; j++) { 
        //         var el = document.createElement('li');
        //         el.appendChild(document.createTextNode((i*j).toString()));
        //         el.setAttribute("style", elStyle)
        //         row.appendChild(el);

        //     }
        //     i++;
        //   });

        // var row = document.createElement('ul');
        // row.setAttribute("style", listStyle)
        // this.table.appendChild(row);

        // for (var j = 1; j <= m; j++) { 
        //     var el = document.createElement('li');
        //     el.appendChild(document.createTextNode((j).toString()));
        //     el.setAttribute("style", elStyle)
        //     row.appendChild(el);
    
        // }
        
        for (var i = 1; i <= n; i++) {
            var row = document.createElement('ul');
            //row.appendChild(document.createTextNode(i.toString()));
            row.setAttribute("style", listStyle)
            this.table.appendChild(row);
            //row.style.setProperty('--scrollbar-color', "red");
            //row.style.overflow = 'hidden';
            //row.style.width = '100%'

            //TO DO GET RID OF SCROLLBARS
            

            //row.style.scrollbarTrackColour.setAttribute("color", "transparent")

            for (var j = 1; j <= m; j++) { 

                var el = document.createElement('li');
                el.appendChild(document.createTextNode((i*j).toString()));
                el.setAttribute("style", elStyle)
                row.appendChild(el);

            }
        }
            

    }
}